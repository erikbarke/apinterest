using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using Apinterest.UnitTests.Mocks;
using Apinterest.Validation;
using NUnit.Framework;

namespace Apinterest.UnitTests.Validation
{
    [TestFixture]
    public class ValidationFactoryTest
    {
        private readonly ValidatorFactory _validatorFactory = new ValidatorFactory();

        [Test]
        public void Factory_Should_Create_Validator_With_Path()
        {
            var validator = _validatorFactory.GetValidator(typeof(object), "object.property");

            Assert.That(validator.Path, Is.EqualTo("object.property"));
        }

        [TestCase(typeof(string))]
        [TestCase(typeof(bool))]
        [TestCase(typeof(char))]
        [TestCase(typeof(DateTime))]
        [TestCase(typeof(TimeSpan))]
        [TestCase(typeof(Guid))]
        [TestCase(typeof(Byte))]
        [TestCase(typeof(SByte))]
        [TestCase(typeof(Int16))]
        [TestCase(typeof(UInt16))]
        [TestCase(typeof(Int32))]
        [TestCase(typeof(UInt32))]
        [TestCase(typeof(Int64))]
        [TestCase(typeof(UInt64))]
        [TestCase(typeof(Decimal))]
        [TestCase(typeof(Single))]
        [TestCase(typeof(Single))]
        [TestCase(typeof(Double))]
        [TestCase(typeof(IEnumerable<string>))]
        [TestCase(typeof(IList<string>))]
        [TestCase(typeof(List<string>))]
        [TestCase(typeof(IDictionary<int, string>))]
        [TestCase(typeof(Dictionary<int, string>))]
        [TestCase(typeof(MockClass))]
        [TestCase(typeof(MockClassType))]
        public void Factory_Should_Create_Validator_With_Type_Name(Type type)
        {
            var validator = _validatorFactory.GetValidator(type, "");

            Assert.That(validator.Type, Is.EqualTo(type.FullName));
        }

        [TestCase(typeof(string), "string")]
        [TestCase(typeof(char), "string")]
        [TestCase(typeof(DateTime), "string")]
        [TestCase(typeof(TimeSpan), "string")]
        [TestCase(typeof(Guid), "string")]
        [TestCase(typeof(bool), "boolean")]
        [TestCase(typeof(Byte), "numeric")]
        [TestCase(typeof(SByte), "numeric")]
        [TestCase(typeof(Int16), "numeric")]
        [TestCase(typeof(UInt16), "numeric")]
        [TestCase(typeof(Int32), "numeric")]
        [TestCase(typeof(UInt32), "numeric")]
        [TestCase(typeof(Int64), "numeric")]
        [TestCase(typeof(UInt64), "numeric")]
        [TestCase(typeof(Decimal), "numeric")]
        [TestCase(typeof(Single), "numeric")]
        [TestCase(typeof(Single), "numeric")]
        [TestCase(typeof(Double), "numeric")]
        [TestCase(typeof(MockClassType), "array")]
        public void Factory_Should_Create_Validator_With_Category(Type type, string category)
        {
            var validator = _validatorFactory.GetValidator(type, "");

            Assert.That(validator.Category, Is.EqualTo(category));
        }

        [TestCase(typeof(char), "a-z|A-Z|0-9|...")]
        [TestCase(typeof(DateTime), "yyyy-MM-dd[THH:mm:ss]")]
        [TestCase(typeof(TimeSpan), "[d.]HH:mm:ss")]
        [TestCase(typeof(Guid), "4fc7b22e-fcfd-498e-b44d-2a98b4040337")]
        [TestCase(typeof(Byte), "0 to 255")]
        [TestCase(typeof(SByte), "-128 to 127")]
        [TestCase(typeof(Int16), "-32768 to 32767")]
        [TestCase(typeof(UInt16), "0 to 65535")]
        [TestCase(typeof(Int32), "-2147483648 to 2147483647")]
        [TestCase(typeof(UInt32), "0 to 4294967295")]
        [TestCase(typeof(Int64), "-9223372036854775808 to 9223372036854775807")]
        [TestCase(typeof(UInt64), "0 to 18446744073709551615")]
        [TestCase(typeof(Decimal), "-79228162514264337593543950335 to 79228162514264337593543950335")]
        [TestCase(typeof(Single), "-3,402823E+38 to 3,402823E+38")]
        [TestCase(typeof(Double), "-1,79769313486232E+308 to 1,79769313486232E+308")]
        public void Factory_Should_Create_Validator_With_Friendly_Pattern(Type type, string friendlyPattern)
        {
            var validator = _validatorFactory.GetValidator(type, "");

            Assert.That(validator.FriendlyPattern, Is.EqualTo(friendlyPattern));
        }

        [TestCase(typeof(char), "x")]
        [TestCase(typeof(DateTime), "2014-04-23")]
        [TestCase(typeof(DateTime), "2014-04-23T22:41:00")]
        [TestCase(typeof(TimeSpan), "23:58:00")]
        [TestCase(typeof(TimeSpan), "1.23:58:00")]
        [TestCase(typeof(Guid), "2312CC30-52D7-491A-A0DB-F71262DA00A5")]
        [TestCase(typeof(Guid), "2312cc30-52d7-491a-a0db-F71262da00a5")]

        [TestCase(typeof(Byte), "0")]
        [TestCase(typeof(Byte), "42")]

        [TestCase(typeof(SByte), "0")]
        [TestCase(typeof(SByte), "42")]
        [TestCase(typeof(SByte), "-42")]

        [TestCase(typeof(Int16), "0")]
        [TestCase(typeof(Int16), "42")]
        [TestCase(typeof(Int16), "-42")]

        [TestCase(typeof(UInt16), "0")]
        [TestCase(typeof(UInt16), "42")]

        [TestCase(typeof(Int32), "0")]
        [TestCase(typeof(Int32), "42")]
        [TestCase(typeof(Int32), "-42")]

        [TestCase(typeof(UInt32), "0")]
        [TestCase(typeof(UInt32), "42")]

        [TestCase(typeof(Int64), "0")]
        [TestCase(typeof(Int64), "42")]
        [TestCase(typeof(Int64), "-42")]

        [TestCase(typeof(UInt64), "0")]
        [TestCase(typeof(UInt64), "42")]

        [TestCase(typeof(Decimal), "0")]
        [TestCase(typeof(Decimal), "0.0")]
        [TestCase(typeof(Decimal), "42")]
        [TestCase(typeof(Decimal), "-42")]
        [TestCase(typeof(Decimal), "42.42")]
        [TestCase(typeof(Decimal), "-42.42")]

        [TestCase(typeof(Single), "0")]
        [TestCase(typeof(Single), "0.0")]
        [TestCase(typeof(Single), "42")]
        [TestCase(typeof(Single), "-42")]
        [TestCase(typeof(Single), "42.42")]
        [TestCase(typeof(Single), "-42.42")]

        [TestCase(typeof(Double), "0")]
        [TestCase(typeof(Double), "0.0")]
        [TestCase(typeof(Double), "42")]
        [TestCase(typeof(Double), "-42")]
        [TestCase(typeof(Double), "42.42")]
        [TestCase(typeof(Double), "-42.42")]
        public void Valid_Value_Should_Pass_Validator_Regex_Pattern(Type type, string value)
        {
            var validator = _validatorFactory.GetValidator(type, "");

            var regex = new Regex(validator.Pattern);

            Assert.That(regex.IsMatch(value), Is.True);
        }

        [TestCase(typeof(Char), "xx")]
        [TestCase(typeof(DateTime), "2014")]
        [TestCase(typeof(TimeSpan), "10:00")]
        [TestCase(typeof(Guid), "xxx-xxx-xxx")]
        public void Invalid_Value_Should_Not_Pass_Validator_Regex_Pattern(Type type, string incorrectValue)
        {
            var validator = _validatorFactory.GetValidator(type, "");

            var regex = new Regex(validator.Pattern);

            Assert.That(regex.IsMatch(incorrectValue), Is.False);
        }

        [TestCase(typeof(Char))]
        [TestCase(typeof(DateTime))]
        [TestCase(typeof(TimeSpan))]
        [TestCase(typeof(Guid))]
        public void Empty_Value_Should_Not_Pass_Validator_Regex_Pattern(Type type)
        {
            var validator = _validatorFactory.GetValidator(type, "");

            var regex = new Regex(validator.Pattern);

            Assert.That(regex.IsMatch(""), Is.False);
        }

        [TestCase(typeof(Byte), "0")]
        [TestCase(typeof(SByte), "-128")]
        [TestCase(typeof(Int16), "-32768")]
        [TestCase(typeof(UInt16), "0")]
        [TestCase(typeof(Int32), "-2147483648")]
        [TestCase(typeof(UInt32), "0")]
        [TestCase(typeof(Int64), "-9223372036854775808")]
        [TestCase(typeof(UInt64), "0")]
        [TestCase(typeof(Decimal), "-79228162514264337593543950335")]
        [TestCase(typeof(Single), "-3,402823E+38")]
        [TestCase(typeof(Double), "-1,79769313486232E+308")]
        public void Factory_Should_Create_Validator_With_Min_Value(Type type, string minValue)
        {
            var validator = _validatorFactory.GetValidator(type, "");

            Assert.That(validator.MinValue.ToString(), Is.EqualTo(minValue));
        }

        [TestCase(typeof(Byte), "255")]
        [TestCase(typeof(SByte), "127")]
        [TestCase(typeof(Int16), "32767")]
        [TestCase(typeof(UInt16), "65535")]
        [TestCase(typeof(Int32), "2147483647")]
        [TestCase(typeof(UInt32), "4294967295")]
        [TestCase(typeof(Int64), "9223372036854775807")]
        [TestCase(typeof(UInt64), "18446744073709551615")]
        [TestCase(typeof(Decimal), "79228162514264337593543950335")]
        [TestCase(typeof(Single), "3,402823E+38")]
        [TestCase(typeof(Double), "1,79769313486232E+308")]
        public void Factory_Should_Create_Validator_With_Max_Value(Type type, string maxValue)
        {
            var validator = _validatorFactory.GetValidator(type, "");

            Assert.That(validator.MaxValue.ToString(), Is.EqualTo(maxValue));
        }
    }
}
