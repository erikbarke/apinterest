using System;
using System.Collections.Generic;
using System.Linq;
using Apinterest.UnitTests.Mocks;
using NUnit.Framework;

namespace Apinterest.UnitTests.Samples
{
    public class SampleFactoryValidatorTest : SampleFactoryTest
    {
        [TestCase(typeof(IEnumerable<bool>), typeof(bool))]
        [TestCase(typeof(IEnumerable<int>), typeof(int))]
        [TestCase(typeof(List<int>), typeof(int))]
        [TestCase(typeof(int[]), typeof(int))]
        [TestCase(typeof(IDictionary<int, string>), typeof(string))]
        [TestCase(typeof(Dictionary<int, string>), typeof(string))]
        [TestCase(typeof(byte[]), typeof(string))] // Base64 encoded byte array in json
        public void Should_Call_ValidatorFactory_With_Element_Type(Type containerType, Type elementType)
        {
            SampleFactory.CreateSample(containerType);

            MockValidatorFactory.Verify(f => f.GetValidator(elementType, ""));
        }

        [Test]
        public void Should_Set_Validator_For_Simple_Object_String()
        {
            var sample = SampleFactory.CreateSample(typeof(string));
            Assert.That(sample.Validators.Count(), Is.EqualTo(1));
        }

        [Test]
        public void Should_Set_ValidatorPath_For_Simple_Object_String()
        {
            var sample = SampleFactory.CreateSample(typeof(string));
            Assert.That(sample.Validators.ElementAt(0).Path, Is.EqualTo(""));
        }

        [Test]
        public void Should_Set_Validator_For_Simple_Object_Int()
        {
            var sample = SampleFactory.CreateSample(typeof(int));
            Assert.That(sample.Validators.Count(), Is.EqualTo(1));
        }

        [Test]
        public void Should_Set_ValidatorPath_For_Simple_Object_Int()
        {
            var sample = SampleFactory.CreateSample(typeof(int));
            Assert.That(sample.Validators.ElementAt(0).Path, Is.EqualTo(""));
        }

        [Test]
        public void Should_Set_Validator_For_Simple_Object_DateTime()
        {
            var sample = SampleFactory.CreateSample(typeof(DateTime));
            Assert.That(sample.Validators.Count(), Is.EqualTo(1));
        }

        [Test]
        public void Should_Set_ValidatorPath_For_Simple_Object_DateTime()
        {
            var sample = SampleFactory.CreateSample(typeof(DateTime));
            Assert.That(sample.Validators.ElementAt(0).Path, Is.EqualTo(""));
        }

        [Test]
        public void Should_Set_Validator_For_Enum()
        {
            var sample = SampleFactory.CreateSample(typeof(MockClassType));
            Assert.That(sample.Validators.Count(), Is.EqualTo(1));
        }

        [Test]
        public void Should_Set_ValidatorPath_For_Enum()
        {
            var sample = SampleFactory.CreateSample(typeof(MockClassType));
            Assert.That(sample.Validators.ElementAt(0).Path, Is.EqualTo(""));
        }

        [Test]
        public void Should_Set_Validators_For_Complex_Object()
        {
            var sample = SampleFactory.CreateSample(typeof(MockComplexObject));
            Assert.That(sample.Validators.Count(), Is.EqualTo(8));
        }

        [Test]
        public void Should_Set_ValidatorPath_For_Complex_Object_Integer()
        {
            var sample = SampleFactory.CreateSample(typeof(MockComplexObject));
            var validator = sample.Validators.SingleOrDefault(v => v.Path == "['integer']");

            Assert.That(validator, Is.Not.Null);
        }

        [Test]
        public void Should_Set_ValidatorPath_For_Complex_Object_String()
        {
            var sample = SampleFactory.CreateSample(typeof(MockComplexObject));
            var validator = sample.Validators.SingleOrDefault(v => v.Path == "['string']");

            Assert.That(validator, Is.Not.Null);
        }

        [Test]
        public void Should_Set_ValidatorPath_For_Complex_Object_Boolean()
        {
            var sample = SampleFactory.CreateSample(typeof(MockComplexObject));
            var validator = sample.Validators.SingleOrDefault(v => v.Path == "['boolean']");

            Assert.That(validator, Is.Not.Null);
        }

        [Test]
        public void Should_Set_ValidatorPath_For_Complex_Object_StringList()
        {
            var sample = SampleFactory.CreateSample(typeof(MockComplexObject));
            var validator = sample.Validators.SingleOrDefault(v => v.Path == "['stringList']");

            Assert.That(validator, Is.Not.Null);
        }

        [Test]
        public void Should_Set_ValidatorPath_For_Complex_Object_StringDictionary()
        {
            var sample = SampleFactory.CreateSample(typeof(MockComplexObject));
            var validator = sample.Validators.SingleOrDefault(v => v.Path == "['dictionary']");

            Assert.That(validator, Is.Not.Null);
        }

        [Test]
        public void Should_Set_ValidatorPath_For_Complex_Object_StringDictionary_Value_PropertyOne()
        {
            var sample = SampleFactory.CreateSample(typeof(MockComplexObject));
            var validator = sample.Validators.SingleOrDefault(v => v.Path == "['dictionary']['propertyOne']");

            Assert.That(validator, Is.Not.Null);
        }

        [Test]
        public void Should_Set_ValidatorPath_For_Complex_Object_StringDictionary_PropertyTwo()
        {
            var sample = SampleFactory.CreateSample(typeof(MockComplexObject));
            var validator = sample.Validators.SingleOrDefault(v => v.Path == "['dictionary']['propertyTwo']");

            Assert.That(validator, Is.Not.Null);
        }

        [Test]
        public void Should_Set_Validator_For_List_Of_Strings()
        {
            var sample = SampleFactory.CreateSample(typeof(IEnumerable<string>));
            var validator = sample.Validators.SingleOrDefault(v => v.Path == "");

            Assert.That(validator, Is.Not.Null);
        }

        [Test]
        public void Should_Set_Validators_For_List_Of_Complex_Objects()
        {
            var sample = SampleFactory.CreateSample(typeof(IEnumerable<MockComplexListObject>));

            Assert.That(sample.Validators.Count(), Is.EqualTo(3));
        }

        [Test]
        public void Should_Set_Validator_For_List_Of_Complex_Objects()
        {
            var sample = SampleFactory.CreateSample(typeof(IEnumerable<MockComplexListObject>));
            var validator = sample.Validators.SingleOrDefault(v => v.Path == "");

            Assert.That(validator, Is.Not.Null);
        }

        [Test]
        public void Should_Set_Validator_For_List_Of_Complex_Objects_Child_Property_Key()
        {
            var sample = SampleFactory.CreateSample(typeof(IEnumerable<MockComplexListObject>));
            var validator = sample.Validators.SingleOrDefault(v => v.Path == "['propertyOne']");

            Assert.That(validator, Is.Not.Null);
        }

        [Test]
        public void Should_Set_Validator_For_List_Of_Complex_Objects_Child_Property_Value()
        {
            var sample = SampleFactory.CreateSample(typeof(IEnumerable<MockComplexListObject>));
            var validator = sample.Validators.SingleOrDefault(v => v.Path == "['propertyTwo']");

            Assert.That(validator, Is.Not.Null);
        }

        [Test]
        public void Should_Set_Validators_For_Struct()
        {
            var sample = SampleFactory.CreateSample(typeof(IEnumerable<MockStruct>));

            Assert.That(sample.Validators.Count(), Is.EqualTo(2));
        }

        [Test]
        public void Should_Set_Validator_For_Struct()
        {
            var sample = SampleFactory.CreateSample(typeof(IEnumerable<MockStruct>));
            var validator = sample.Validators.SingleOrDefault(v => v.Path == "");

            Assert.That(validator, Is.Not.Null);
        }

        [Test]
        public void Should_Set_Validator_For_Struct_Property_Name()
        {
            var sample = SampleFactory.CreateSample(typeof(IEnumerable<MockStruct>));
            var validator = sample.Validators.SingleOrDefault(v => v.Path == "['name']");

            Assert.That(validator, Is.Not.Null);
        }
    }
}
