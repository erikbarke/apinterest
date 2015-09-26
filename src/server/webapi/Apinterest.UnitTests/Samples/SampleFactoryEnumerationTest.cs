using System.Collections.Generic;
using NUnit.Framework;

namespace Apinterest.UnitTests.Samples
{
    public class SampleFactoryEnumerationTest : SampleFactoryTest
    {
        [Test]
        public void Should_Instantiate_Array_String()
        {
            var sample = SampleFactory.CreateSample(typeof(string[]));

            Assert.That(sample.Instance, Is.EquivalentTo(new[] { "abc123" }));
        }

        [Test]
        public void Should_Instantiate_Array_Int()
        {
            var sample = SampleFactory.CreateSample(typeof(int[]));

            Assert.That(sample.Instance, Is.EquivalentTo(new[] { 42 }));
        }

        [Test]
        public void Should_Instantiate_Generic_IEnumerable()
        {
            var sample = SampleFactory.CreateSample(typeof(IEnumerable<string>));

            Assert.That(sample.Instance, Is.EquivalentTo(new List<string> { "abc123" }));
        }

        [Test]
        public void Should_Instantiate_Generic_ICollection()
        {
            var sample = SampleFactory.CreateSample(typeof(ICollection<string>));

            Assert.That(sample.Instance, Is.EquivalentTo(new List<string> { "abc123" }));
        }

        [Test]
        public void Should_Instantiate_Generic_IList()
        {
            var sample = SampleFactory.CreateSample(typeof(IList<string>));

            Assert.That(sample.Instance, Is.EquivalentTo(new List<string> { "abc123" }));
        }

        [Test]
        public void Should_Instantiate_Generic_List()
        {
            var sample = SampleFactory.CreateSample(typeof(List<string>));

            Assert.That(sample.Instance, Is.EquivalentTo(new List<string> { "abc123" }));
        }

        [Test]
        public void Should_Instantiate_Generic_SortedList()
        {
            var sample = SampleFactory.CreateSample(typeof(SortedList<string, int>));

            Assert.That(sample.Instance, Is.EquivalentTo(new SortedList<string, int> { { "abc123", 42 } }));
        }

        [Test]
        public void Should_Instantiate_Generic_IDictionary()
        {
            var sample = SampleFactory.CreateSample(typeof(IDictionary<string, int>));

            Assert.That(sample.Instance, Is.EquivalentTo(new Dictionary<string, int> { { "abc123", 42 } }));
        }

        [Test]
        public void Should_Instantiate_Generic_Dictionary()
        {
            var sample = SampleFactory.CreateSample(typeof(Dictionary<string, int>));

            Assert.That(sample.Instance, Is.EquivalentTo(new Dictionary<string, int> { { "abc123", 42 } }));
        }
    }
}
