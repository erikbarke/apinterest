using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using Apinterest.Time;
using Apinterest.Validation;
using log4net;

namespace Apinterest.Samples
{
    public class SampleFactory : ISampleFactory
    {
        public const byte MaxDepth = 10;
        private readonly IValidatorFactory _validatorFactory;
        private readonly ITimeMachine _timeMachine;
        private readonly ILog _log;

        public SampleFactory(IValidatorFactory validatorFactory, ITimeMachine timeMachine, ILog log)
        {
            _validatorFactory = validatorFactory;
            _log = log;
            _timeMachine = timeMachine;
        }

        public Sample CreateSample(Type type)
        {
            if (type == null) { return null; }

            try
            {
                var validators = new List<Validator>();
                AddValidator(type, "", validators);

                var instance = CreateInstance(type, "", 0, validators);
                var category = GetCategory(type);

                return new Sample(instance, category, validators);
            }
            catch (Exception e)
            {
                _log.Error(e);
            }

            return null;
        }

        private static string GetCategory(Type type)
        {
            var realType = UnpackNullable(type);

            if (TypeDescriptor.GetConverter(realType).CanConvertFrom(typeof(string)))
            {
                return "simple";
            }

            if (IsGenericDictionary(realType) || ImplementsGenericDictionary(realType))
            {
                return "hashtable";
            }

            if (IsList(realType))
            {
                return "array";
            }

            return "object";
        }

        private void AddValidator(Type type, string propertyPath, ICollection<Validator> validators)
        {
            Validator validator;

            var realType = UnpackNullable(type);

            if (IsGenericDictionary(realType) || ImplementsGenericDictionary(realType))
            {
                validator = _validatorFactory.GetValidator(realType.GetGenericArguments()[1], propertyPath);
            }
            else if (IsBase64EncodedType(type))
            {
                validator = _validatorFactory.GetValidator(typeof(string), propertyPath);
                validator.Type = realType.FullName + " (base64 encoded)";
            }
            else if (IsList(realType))
            {
                var enumerableType = realType.IsArray ?
                    realType.GetElementType() :
                    realType.GetGenericArguments()[0];

                validator = _validatorFactory.GetValidator(enumerableType, propertyPath);
                validator.Type = realType.FullName;
            }
            else
            {
                validator = _validatorFactory.GetValidator(realType, propertyPath);
            }

            validators.Add(validator);
        }

        private static Type UnpackNullable(Type type)
        {
            return IsNullable(type) ? Nullable.GetUnderlyingType(type) : type;
        }

        private object CreateInstance(Type type, string propertyPath, int currentDepth, ICollection<Validator> validators)
        {
            var realType = UnpackNullable(type);

            if (realType == typeof(string)) { return "abc123"; }
            if (realType == typeof(bool)) { return true; }
            if (realType == typeof(char)) { return 'a'; }
            if (realType == typeof(byte)) { return (byte)42; }
            if (realType == typeof(sbyte)) { return (sbyte)42; }
            if (realType == typeof(short)) { return (short)42; }
            if (realType == typeof(ushort)) { return (ushort)42; }
            if (realType == typeof(int)) { return 42; }
            if (realType == typeof(uint)) { return 42U; }
            if (realType == typeof(long)) { return 42L; }
            if (realType == typeof(ulong)) { return 42UL; }
            if (realType == typeof(decimal)) { return 42.42M; }
            if (realType == typeof(double)) { return 42.42D; }
            if (realType == typeof(float)) { return 42.42F; }
            if (realType == typeof(DateTime)) { return _timeMachine.DateTime; }
            if (realType == typeof(TimeSpan)) { return _timeMachine.Time; }
            if (realType == typeof(Guid)) { return Guid.NewGuid(); }
            if (realType == typeof(Uri)) { return new Uri("http://host/path"); }

            if (realType.IsEnum)
            {
                return GetFirstEnumValue(realType);
            }

            if (IsGenericEnumerable(realType) || ImplementsGenericEnumerable(realType))
            {
                return CreateGenericEnumerationInstance(realType, propertyPath, currentDepth, validators);
            }

            var instance = IsStruct(realType) ?
                Activator.CreateInstance(realType) :
                CreateInstanceFromConstructor(realType, propertyPath, currentDepth, validators);

            SetProperties(instance, propertyPath, currentDepth, validators);
            SetFields(instance, propertyPath, currentDepth, validators);

            return instance;
        }

        private static object GetFirstEnumValue(Type type)
        {
            var enumValues = Enum.GetValues(type);
            return enumValues.Length > 0 ? enumValues.GetValue(0) : 0;
        }

        private object CreateGenericEnumerationInstance(Type type, string propertyPath, int currentDepth, ICollection<Validator> validators)
        {
            object enumeration;

            if (type.IsInterface)
            {
                var instanceType = IsGenericDictionary(type) ? typeof(Dictionary<,>) : typeof(List<>);
                enumeration = CreateGenericInstance(type, instanceType);
            }
            else if (type.IsArray)
            {
                var array = Array.CreateInstance(type.GetElementType(), 1);
                var value = CreateInstance(type.GetElementType(), propertyPath, currentDepth + 1, validators);
                array.SetValue(value, 0);

                enumeration = array;
            }
            else
            {
                enumeration = CreateInstanceFromConstructor(type, propertyPath, currentDepth, validators);
            }

            if (currentDepth < MaxDepth)
            {
                AddItemToGenericContainer(enumeration, propertyPath, currentDepth, validators);
            }

            return enumeration;
        }

        private static object CreateGenericInstance(Type argumentType, Type instanceType)
        {
            var typeArguments = argumentType.GetGenericArguments();
            var genericType = instanceType.MakeGenericType(typeArguments);

            return Activator.CreateInstance(genericType);
        }

        private void AddItemToGenericContainer(object instance, string propertyPath, int currentDepth, ICollection<Validator> validators)
        {
            var type = instance.GetType();
            var addMethod = type.GetMethod("Add");

            if (addMethod != null)
            {
                var typeArguments = type.GetGenericArguments();

                var values = new object[typeArguments.Length];

                for (var i = 0; i < typeArguments.Length; i++)
                {
                    values[i] = CreateInstance(typeArguments[i], propertyPath, currentDepth + 1, validators);
                }

                addMethod.Invoke(instance, values);
            }
        }

        private object CreateInstanceFromConstructor(Type type, string propertyPath, int currentDepth, ICollection<Validator> validators)
        {
            if (currentDepth < MaxDepth)
            {
                var constructor = FindConstructorWithFewestParameters(type);

                if (constructor != null)
                {
                    var parameters = constructor.GetParameters();
                    var constructorParameters = new object[parameters.Length];

                    for (var i = 0; i < parameters.Length; i++)
                    {
                        constructorParameters[i] = CreateInstance(parameters[i].ParameterType, propertyPath, currentDepth + 1, validators);
                    }

                    return constructor.Invoke(constructorParameters);
                }
            }

            return null;
        }

        private static ConstructorInfo FindConstructorWithFewestParameters(Type type)
        {
            var constructors = type.GetConstructors(BindingFlags.Public | BindingFlags.Instance);

            return constructors.Length > 0 ?
                constructors.OrderBy(c => c.GetParameters().Count()).First() :
                null;
        }

        private void SetProperties(object instance, string propertyPath, int currentDepth, ICollection<Validator> validators)
        {
            if (currentDepth < MaxDepth && instance != null)
            {
                foreach (var property in instance.GetType().GetProperties())
                {
                    if (property.CanWrite)
                    {
                        var currentPropertyPath = GetPropertyPath(propertyPath, property.Name);

                        var value = CreateInstance(property.PropertyType, currentPropertyPath, currentDepth + 1, validators);

                        if (value != null)
                        {
                            property.SetValue(instance, value);
                        }

                        AddValidator(property.PropertyType, currentPropertyPath, validators);
                    }
                }
            }
        }

        private void SetFields(object instance, string propertyPath, int currentDepth, ICollection<Validator> validators)
        {
            if (currentDepth < MaxDepth && instance != null)
            {
                foreach (var field in instance.GetType().GetFields().Where(f => !f.IsLiteral && !f.IsInitOnly))
                {
                    var currentPropertyPath = GetPropertyPath(propertyPath, field.Name);

                    var value = CreateInstance(field.FieldType, currentPropertyPath, currentDepth + 1, validators);

                    if (value != null)
                    {
                        field.SetValue(instance, value);
                    }

                    AddValidator(field.FieldType, currentPropertyPath, validators);
                }
            }
        }

        private static bool IsList(Type realType)
        {
            return IsGenericEnumerable(realType) || ImplementsGenericEnumerable(realType) && realType != typeof(string);
        }

        private static bool IsNullable(Type type)
        {
            return IsGenericType(type, typeof(Nullable<>));
        }

        private static bool IsGenericDictionary(Type type)
        {
            return IsGenericType(type, typeof(IDictionary<,>));
        }

        private static bool IsGenericEnumerable(Type type)
        {
            return IsGenericType(type, typeof(IEnumerable<>));
        }

        private static bool IsGenericType(Type a, Type b)
        {
            return a.IsGenericType && a.GetGenericTypeDefinition() == b;
        }

        private static bool ImplementsGenericEnumerable(Type type)
        {
            return ImplementsGenericInterface(type, typeof(IEnumerable<>));
        }

        private static bool ImplementsGenericDictionary(Type type)
        {
            return ImplementsGenericInterface(type, typeof(IDictionary<,>));
        }

        private static bool ImplementsGenericInterface(Type a, Type b)
        {
            return a
                .GetInterfaces()
                .Any(t => t.IsGenericType && t.GetGenericTypeDefinition() == b);
        }

        private static bool IsStruct(Type realType)
        {
            return realType.IsValueType && !realType.IsEnum;
        }

        private static bool IsBase64EncodedType(Type type)
        {
            return type == typeof(byte[]);
        }

        private static string GetPropertyPath(string parentPath, string childPath)
        {
            return parentPath + "['" + FirstToLower(childPath) + "']";
        }

        private static string FirstToLower(string s)
        {
            return char.ToLowerInvariant(s[0]) + s.Substring(1);
        }
    }
}
