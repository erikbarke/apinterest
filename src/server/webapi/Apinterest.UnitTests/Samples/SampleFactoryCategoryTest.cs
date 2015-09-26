using System;
using System.Collections.Generic;
using NUnit.Framework;

namespace Apinterest.UnitTests.Samples
{
    public class SampleFactoryCategoryTest : SampleFactoryTest
    {
        [TestCase(typeof(string), "simple")]
        [TestCase(typeof(int), "simple")]
        [TestCase(typeof(DateTime), "simple")]

        [TestCase(typeof(IEnumerable<string>), "array")]
        [TestCase(typeof(ICollection<string>), "array")]
        [TestCase(typeof(IList<string>), "array")]
        [TestCase(typeof(List<string>), "array")]
        [TestCase(typeof(string[]), "array")]

        [TestCase(typeof(IDictionary<string, string>), "hashtable")]
        [TestCase(typeof(Dictionary<string, string>), "hashtable")]
        public void Should_Add_Category_For_Type(Type type, string category)
        {
            var sample = SampleFactory.CreateSample(type);

            Assert.That(sample.Category, Is.EqualTo(category));
        }
    }
}
