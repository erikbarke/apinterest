using System;
using NUnit.Framework;
using Apinterest.Time;

namespace Apinterest.UnitTests.Time
{
    [TestFixture]
    public class TimeMachineTest
    {
        private TimeMachine _timeMachine;

        [SetUp]
        public void SetUp()
        {
            _timeMachine = new TimeMachine();
        }

        [Test]
        public void Should_Return_DateTime_With_Zero_Milliseconds()
        {
            Assert.That(_timeMachine.DateTime.Millisecond, Is.EqualTo(0));
        }

        [Test]
        public void Should_Return_Time_With_Zero_Milliseconds()
        {
            Assert.That(_timeMachine.Time.Milliseconds, Is.EqualTo(0));
        }
    }
}
