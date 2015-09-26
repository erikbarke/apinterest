using System;
using System.Linq;

namespace Apinterest.Validation
{
    public class ValidatorFactory : IValidatorFactory
    {
        public Validator GetValidator(Type type, string path)
        {
            var validator = new Validator
            {
                Type = type.FullName,
                Category = "string",
                Path = path
            };

            if (type == typeof(Boolean))
            {
                validator.Category = "boolean";
            }

            if (type == typeof(Char))
            {
                validator.Pattern = @"^[\u0000-\uFFFF]$";
                validator.FriendlyPattern = "a-z|A-Z|0-9|...";
            }

            if (type == typeof(DateTime))
            {
                validator.Pattern = @"^\d{4}-[01]\d-[0-3]\d(T[0-2]\d:[0-5]\d:[0-5]\d)?$";
                validator.FriendlyPattern = "yyyy-MM-dd[THH:mm:ss]";
            }

            if (type == typeof(TimeSpan))
            {
                validator.Pattern = @"^(\d{0,7}\.)?((0?\d)|(1\d)|(2[0-3]))(:[0-5]\d){2}$";
                validator.FriendlyPattern = "[d.]HH:mm:ss";
            }

            if (type == typeof(Guid))
            {
                validator.Pattern = @"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$";
                validator.FriendlyPattern = "4fc7b22e-fcfd-498e-b44d-2a98b4040337";
            }

            if (type == typeof(Byte))
            {
                validator.Category = "numeric";
                validator.Pattern = @"^\d+$";
                validator.MinValue = Byte.MinValue;
                validator.MaxValue = Byte.MaxValue;
                validator.FriendlyPattern = Byte.MinValue + " to " + Byte.MaxValue;
            }

            if (type == typeof(SByte))
            {
                validator.Category = "numeric";
                validator.Pattern = @"^(-?)\d+$";
                validator.MinValue = SByte.MinValue;
                validator.MaxValue = SByte.MaxValue;
                validator.FriendlyPattern = SByte.MinValue + " to " + SByte.MaxValue;
            }

            if (type == typeof(Int16))
            {
                validator.Category = "numeric";
                validator.Pattern = @"^(-?)\d+$";
                validator.MinValue = Int16.MinValue;
                validator.MaxValue = Int16.MaxValue;
                validator.FriendlyPattern = Int16.MinValue + " to " + Int16.MaxValue;
            }

            if (type == typeof(UInt16))
            {
                validator.Category = "numeric";
                validator.Pattern = @"^\d+$";
                validator.MinValue = UInt16.MinValue;
                validator.MaxValue = UInt16.MaxValue;
                validator.FriendlyPattern = UInt16.MinValue + " to " + UInt16.MaxValue;
            }

            if (type == typeof(Int32))
            {
                validator.Category = "numeric";
                validator.Pattern = @"^(-?)\d+$";
                validator.MinValue = Int32.MinValue;
                validator.MaxValue = Int32.MaxValue;
                validator.FriendlyPattern = Int32.MinValue + " to " + Int32.MaxValue;
            }

            if (type == typeof(UInt32))
            {
                validator.Category = "numeric";
                validator.Pattern = @"^\d+$";
                validator.MinValue = UInt32.MinValue;
                validator.MaxValue = UInt32.MaxValue;
                validator.FriendlyPattern = UInt32.MinValue + " to " + UInt32.MaxValue;
            }

            if (type == typeof(Int64))
            {
                validator.Category = "numeric";
                validator.Pattern = @"^(-?)\d+$";
                validator.MinValue = Int64.MinValue;
                validator.MaxValue = Int64.MaxValue;
                validator.FriendlyPattern = Int64.MinValue + " to " + Int64.MaxValue;
            }

            if (type == typeof(UInt64))
            {
                validator.Category = "numeric";
                validator.Pattern = @"^\d+$";
                validator.MinValue = UInt64.MinValue;
                validator.MaxValue = UInt64.MaxValue;
                validator.FriendlyPattern = UInt64.MinValue + " to " + UInt64.MaxValue;
            }

            if (type == typeof(Decimal))
            {
                validator.Category = "numeric";
                validator.Pattern = @"^-?\d*(\.\d+)?$";
                validator.MinValue = Decimal.MinValue;
                validator.MaxValue = Decimal.MaxValue;
                validator.FriendlyPattern = Decimal.MinValue + " to " + Decimal.MaxValue;
            }

            if (type == typeof(Single))
            {
                validator.Category = "numeric";
                validator.Pattern = @"^-?\d*(\.\d+)?$";
                validator.MinValue = Single.MinValue;
                validator.MaxValue = Single.MaxValue;
                validator.FriendlyPattern = Single.MinValue + " to " + Single.MaxValue;
            }

            if (type == typeof(Double))
            {
                validator.Category = "numeric";
                validator.Pattern = @"^-?\d*(\.\d+)?$";
                validator.MinValue = Double.MinValue;
                validator.MaxValue = Double.MaxValue;
                validator.FriendlyPattern = Double.MinValue + " to " + Double.MaxValue;
            }

            if (type.IsEnum)
            {
                validator.Category = "array";

                var values = from object value in Enum.GetValues(type)
                             select value.ToString();

                validator.Values = values.ToList();
            }

            return validator;
        }
    }
}
