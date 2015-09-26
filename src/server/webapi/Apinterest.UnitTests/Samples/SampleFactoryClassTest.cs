using System;
using System.Linq;
using System.Reflection;
using Apinterest.Samples;
using NUnit.Framework;
using Apinterest.UnitTests.Mocks;
using Moq;

namespace Apinterest.UnitTests.Samples
{
    public class SampleFactoryClassTest : SampleFactoryTest
    {
        private Sample _sample;
        private MockClass _mockClass;

        [SetUp]
        public void LocalSetup()
        {
            _sample = SampleFactory.CreateSample(typeof(MockClass));
            _mockClass = _sample.Instance as MockClass;

            Assert.That(_mockClass != null);
        }

        [Test]
        public void Should_Instantiate_MockClass_With_Field_From_Base_Class()
        {
            Assert.That(_mockClass.BaseClassString, Is.EqualTo("abc123"));
        }

        [Test]
        public void Should_Instantiate_MockClass_With_Property_From_Base_Class()
        {
            Assert.That(_mockClass.GetStringFromBaseClass, Is.EqualTo("abc123"));
        }

        [Test]
        public void Should_Instantiate_MockClass_Public_Static_Field_Int()
        {
            Assert.That(MockClass.PublicStaticInt, Is.EqualTo(42));
        }

        [Test]
        public void Should_Instantiate_MockClass_Public__Static_Field_String()
        {
            Assert.That(MockClass.PublicStaticString, Is.EqualTo("abc123"));
        }

        [Test]
        public void Should_Instantiate_MockClass_Public_Field_Int()
        {
            Assert.That(_mockClass.PublicInt, Is.EqualTo(42));
        }

        [Test]
        public void Should_Instantiate_MockClass_Public_Field_String()
        {
            Assert.That(_mockClass.PublicString, Is.EqualTo("abc123"));
        }

        [Test]
        public void Should_Instantiate_MockClass_Guid()
        {
            Assert.That(_mockClass.Guid != Guid.Empty);
        }

        [Test]
        public void Should_Instantiate_MockClass_Enumerable()
        {
            Assert.That(_mockClass.Enumerable.Count(), Is.EqualTo(1));
            Assert.That(_mockClass.Enumerable.First().String, Is.EqualTo("abc123"));
        }

        [Test]
        public void Should_Instantiate_MockClass_Constructorless_Struct()
        {
            Assert.That(_mockClass.Struct.Name, Is.EqualTo("abc123"));
        }

        [Test]
        public void Should_Instantiate_MockClass_Dictionary()
        {
            Assert.That(_mockClass.Dictionary.Count(), Is.EqualTo(1));
            Assert.That(_mockClass.Dictionary.First().Key, Is.EqualTo("abc123"));
            Assert.That(_mockClass.Dictionary.First().Value, Is.EqualTo(42));
        }

        [Test]
        public void Should_Instantiate_MockClass_Enum()
        {
            Assert.That(_mockClass.Enum, Is.EqualTo(MockClassType.CodeSmell));
        }

        [Test]
        public void Should_Instantiate_MockClass_Date()
        {
            Assert.That(_mockClass.Date, Is.EqualTo(MockTimeMachine.Object.DateTime));
        }

        [Test]
        public void Should_Instantiate_MockClass_And_Handle_Circular_Reference_In_Constructor()
        {
            var lastCircularReference =

                _mockClass
                    .Enumerable
                    .First()
                    .MetaReference
                    .MetaReference
                    .MetaReference
                    .MetaReference
                    .MetaReference
                    .MetaReference
                    .MetaReference
                    .MetaReference;

            Assert.That(lastCircularReference, Is.Null);
        }

        [Test]
        public void Should_Instantiate_MockClass_And_Handle_Circular_Reference_In_Property()
        {
            var lastCircularReference =

                _mockClass
                    .Enumerable
                    .First()
                    .PropertyWithCircularReference
                    .Enumerable
                    .First()
                    .PropertyWithCircularReference
                    .Enumerable
                    .First()
                    .PropertyWithCircularReference
                    .Enumerable
                    .FirstOrDefault();

            Assert.That(lastCircularReference, Is.Null);
        }

        [Test]
        public void Should_Instantiate_MockClass_And_Handle_Circular_Reference_In_Enumerable()
        {
            var lastCircularReference =

                _mockClass
                    .Enumerable
                    .First()
                    .ListWithCircularReferences
                    .First()
                    .ListWithCircularReferences
                    .First()
                    .ListWithCircularReferences
                    .First()
                    .ListWithCircularReferences
                    .FirstOrDefault();

            Assert.That(lastCircularReference, Is.Null);
        }

        [Test]
        public void Should_Instantiate_MockClass_And_Set_NullableSbyte_Property()
        {
            Assert.That(_mockClass.NullableSbyte, Is.EqualTo(42));
        }

        [Test]
        public void Should_Instantiate_MockClass_And_Set_NullableLong_Property()
        {
            Assert.That(_mockClass.NullableLong, Is.EqualTo(42));
        }

        [Test]
        public void Should_Instantiate_MockClass_And_Set_NullableSbyte_Decimal()
        {
            Assert.That(_mockClass.Decimal, Is.EqualTo(42.42));
        }

        [Test]
        public void Should_Handle_Constructor_That_Throws_Exception()
        {
            var angryConstructorSample = SampleFactory.CreateSample(typeof(MockClassWithAngryConstructor));

            Assert.That(angryConstructorSample, Is.Null);

            Log.Verify(l => l.Error(It.Is<TargetInvocationException>(e => e.InnerException.Message == "Invalid parameter value: abc123")));
        }
    }
}
