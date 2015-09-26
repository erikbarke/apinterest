using System;
using NUnit.Framework;
using Apinterest.Resources;

namespace Apinterest.UnitTests.Resources
{
    [TestFixture]
    public class ResourceLookupTest
    {
        private ResourceLookup _resourceLookup;

        [SetUp]
        public void SetUp()
        {
            _resourceLookup = new ResourceLookup("Apinterest.UnitTests.dll");
        }

        [Test]
        public void Should_Lookup_Text_Resource_In_Path()
        {
            var resource = _resourceLookup.GetString("Apinterest/UnitTests/Mocks/Resources/test-version-2014.3/mock-resource.test.txt");

            Assert.That(resource, Is.EqualTo("test resource text"));
        }

        [Test]
        public void Should_Lookup_Text_Resource_With_Only_File_Name()
        {
            var resource = _resourceLookup.GetString("mock-resource.test.txt");

            Assert.That(resource, Is.EqualTo("test resource text"));
        }

        [Test]
        public void Should_Handle_Non_Existing_Resource()
        {
            Assert.Throws(typeof(ArgumentException), () =>
            {
                _resourceLookup.GetString("DoesNotExist.txt");
            });
        }
    }
}
