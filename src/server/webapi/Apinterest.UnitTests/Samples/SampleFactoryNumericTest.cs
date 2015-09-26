using System;
using NUnit.Framework;

namespace Apinterest.UnitTests.Samples
{
    public class SampleFactoryNumericTest : SampleFactoryTest
    {
        [Test]
        public void Should_Instantiate_Enum()
        {
            var sample = SampleFactory.CreateSample(typeof(AttributeTargets));

            Assert.That(sample.Instance.Equals(AttributeTargets.Assembly));
        }

        [Test]
        public void Should_Instantiate_Enum_Nullable()
        {
            var sample = SampleFactory.CreateSample(typeof(AttributeTargets?));

            Assert.That(sample.Instance.Equals(AttributeTargets.Assembly));
        }

        [Test]
        public void Should_Instantiate_Byte()
        {
            var sample = SampleFactory.CreateSample(typeof(byte));

            Assert.That(sample.Instance.Equals((byte)42));
        }

        [Test]
        public void Should_Instantiate_Byte_Nullable()
        {
            var sample = SampleFactory.CreateSample(typeof(byte?));

            Assert.That(sample.Instance.Equals((byte?)42));
        }

        [Test]
        public void Should_Instantiate_SByte()
        {
            var sample = SampleFactory.CreateSample(typeof(sbyte));

            Assert.That(sample.Instance.Equals((sbyte)42));
        }

        [Test]
        public void Should_Instantiate_SByte_Nullable()
        {
            var sample = SampleFactory.CreateSample(typeof(sbyte?));

            Assert.That(sample.Instance.Equals((sbyte?)42));
        }

        [Test]
        public void Should_Instantiate_Int16()
        {
            var sample = SampleFactory.CreateSample(typeof(short));

            Assert.That(sample.Instance.Equals((short)42));
        }

        [Test]
        public void Should_Instantiate_Int16_Nullable()
        {
            var sample = SampleFactory.CreateSample(typeof(short?));

            Assert.That(sample.Instance.Equals((short?)42));
        }

        [Test]
        public void Should_Instantiate_UInt16()
        {
            var sample = SampleFactory.CreateSample(typeof(ushort));

            Assert.That(sample.Instance.Equals((ushort)42));
        }

        [Test]
        public void Should_Instantiate_UInt16_Nullable()
        {
            var sample = SampleFactory.CreateSample(typeof(ushort?));

            Assert.That(sample.Instance.Equals((ushort?)42));
        }

        [Test]
        public void Should_Instantiate_Int32()
        {
            var sample = SampleFactory.CreateSample(typeof(int));

            Assert.That(sample.Instance.Equals(42));
        }

        [Test]
        public void Should_Instantiate_Int32_Nullable()
        {
            var sample = SampleFactory.CreateSample(typeof(int?));

            Assert.That(sample.Instance.Equals((int?)42));
        }

        [Test]
        public void Should_Instantiate_UInt32()
        {
            var sample = SampleFactory.CreateSample(typeof(uint));

            Assert.That(sample.Instance.Equals((uint)42));
        }

        [Test]
        public void Should_Instantiate_UInt32_Nullable()
        {
            var sample = SampleFactory.CreateSample(typeof(uint?));

            Assert.That(sample.Instance.Equals((uint?)42));
        }

        [Test]
        public void Should_Instantiate_Int64()
        {
            var sample = SampleFactory.CreateSample(typeof(long));

            Assert.That(sample.Instance.Equals((long)42));
        }

        [Test]
        public void Should_Instantiate_Int64_Nullable()
        {
            var sample = SampleFactory.CreateSample(typeof(long?));

            Assert.That(sample.Instance.Equals((long?)42));
        }

        [Test]
        public void Should_Instantiate_UInt64()
        {
            var sample = SampleFactory.CreateSample(typeof(ulong));

            Assert.That(sample.Instance.Equals((ulong)42));
        }

        [Test]
        public void Should_Instantiate_UInt64_Nullable()
        {
            var sample = SampleFactory.CreateSample(typeof(ulong?));

            Assert.That(sample.Instance.Equals((ulong?)42));
        }

        [Test]
        public void Should_Instantiate_Decimal()
        {
            var sample = SampleFactory.CreateSample(typeof(decimal));

            Assert.That(sample.Instance.Equals((decimal)42.42));
        }

        [Test]
        public void Should_Instantiate_Decimal_Nullable()
        {
            var sample = SampleFactory.CreateSample(typeof(decimal?));

            Assert.That(sample.Instance.Equals((decimal?)42.42));
        }

        [Test]
        public void Should_Instantiate_Double()
        {
            var sample = SampleFactory.CreateSample(typeof(double));

            Assert.That(sample.Instance.Equals(42.42));
        }

        [Test]
        public void Should_Instantiate_Double_Nullable()
        {
            var sample = SampleFactory.CreateSample(typeof(double?));

            Assert.That(sample.Instance.Equals((double?)42.42));
        }

        [Test]
        public void Should_Instantiate_Single()
        {
            var sample = SampleFactory.CreateSample(typeof(float));

            Assert.That(sample.Instance.Equals((float)42.42));
        }

        [Test]
        public void Should_Instantiate_Single_Nullable()
        {
            var sample = SampleFactory.CreateSample(typeof(float?));

            Assert.That(sample.Instance.Equals((float?)42.42));
        }
    }
}
