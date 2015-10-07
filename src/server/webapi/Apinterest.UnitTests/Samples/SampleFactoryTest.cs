using System;
using Apinterest.Samples;
using Apinterest.Time;
using Apinterest.Validation;
using log4net;
using Moq;
using NUnit.Framework;

namespace Apinterest.UnitTests.Samples
{
    public class SampleFactoryTest
    {
        protected SampleFactory SampleFactory;
        protected Mock<ILog> Log;
        protected Mock<ITimeMachine> MockTimeMachine;
        protected Mock<IValidatorFactory> MockValidatorFactory;

        [SetUp]
        public void Setup()
        {
            MockValidatorFactory = new Mock<IValidatorFactory>();
            MockValidatorFactory
                .Setup(f => f.GetValidator(It.IsAny<Type>(), It.IsAny<string>()))
                .Returns((Type type, string path) => new Validator { Path = path });

            MockTimeMachine = new Mock<ITimeMachine>();
            MockTimeMachine.Setup(t => t.DateTime).Returns(new DateTime(1983, 6, 13));
            MockTimeMachine.Setup(t => t.Time).Returns(new TimeSpan(23, 58, 0));

            Log = new Mock<ILog>();

            SampleFactory = new SampleFactory(MockValidatorFactory.Object, MockTimeMachine.Object, Log.Object);
        }

        [Test]
        public void Should_Instantiate_String()
        {
            var sample = SampleFactory.CreateSample(typeof(string));

            Assert.That(sample.Instance, Is.EqualTo("abc123"));
        }

        [Test]
        public void Should_Instantiate_Char()
        {
            var sample = SampleFactory.CreateSample(typeof(char));

            Assert.That(sample.Instance, Is.EqualTo('a'));
        }

        [Test]
        public void Should_Instantiate_Char_Nullable()
        {
            var sample = SampleFactory.CreateSample(typeof(char?));

            Assert.That(sample.Instance, Is.EqualTo((char?)'a'));
        }

        [Test]
        public void Should_Instantiate_Bool()
        {
            var sample = SampleFactory.CreateSample(typeof(bool));

            Assert.That(sample.Instance, Is.True);
        }

        [Test]
        public void Should_Instantiate_Bool_Nullable()
        {
            var sample = SampleFactory.CreateSample(typeof(bool?));

            Assert.That(sample.Instance, Is.EqualTo((bool?)true));
        }

        [Test]
        public void Should_Instantiate_DateTime()
        {
            var sample = SampleFactory.CreateSample(typeof(DateTime));

            Assert.That(sample.Instance, Is.EqualTo(MockTimeMachine.Object.DateTime));
        }

        [Test]
        public void Should_Instantiate_DateTime_Nullable()
        {
            var sample = SampleFactory.CreateSample(typeof(DateTime?));

            Assert.That(sample.Instance, Is.EqualTo((DateTime?)MockTimeMachine.Object.DateTime));
        }

        [Test]
        public void Should_Instantiate_TimeSpan()
        {
            var sample = SampleFactory.CreateSample(typeof(TimeSpan));

            Assert.That(sample.Instance, Is.EqualTo(MockTimeMachine.Object.Time));
        }

        [Test]
        public void Should_Instantiate_TimeSpan_Nullable()
        {
            var sample = SampleFactory.CreateSample(typeof(TimeSpan?));

            Assert.That(sample.Instance, Is.EqualTo((TimeSpan?)MockTimeMachine.Object.Time));
        }

        [Test]
        public void Should_Instantiate_Guid()
        {
            var sample = SampleFactory.CreateSample(typeof(Guid));

            Assert.That(sample.Instance, Is.Not.EqualTo(Guid.Empty));
            Assert.That(sample.Instance is Guid);
        }

        [Test]
        public void Should_Instantiate_Guid_Nullable()
        {
            var sample = SampleFactory.CreateSample(typeof(Guid?));

            Assert.That(sample.Instance, Is.Not.EqualTo(Guid.Empty));
            Assert.That(sample.Instance is Guid?);
        }

        [Test]
        public void Should_Instantiate_Uri()
        {
            var sample = SampleFactory.CreateSample(typeof(Uri));

            Assert.That(sample.Instance, Is.EqualTo(new Uri("http://host/path")));
        }

        [Test]
        public void Should_Instantiate_And_Handle_Null()
        {
            var sample = SampleFactory.CreateSample(null);

            Assert.That(sample, Is.Null);
        }
    }
}
