using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Apinterest.Contracts;
using Apinterest.Resources;
using Moq;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using NUnit.Framework;

namespace Apinterest.UnitTests
{
    [TestFixture]
    public class ContentControllerTest
    {
        private ContentController _contentController;

        private Mock<IRouteExplorerService> _mockRouteExplorerService;
        private Mock<IResourceLookup> _mockResourceLookup;
            
        [SetUp]
        public void SetUp()
        {
            _mockRouteExplorerService = new Mock<IRouteExplorerService>();

            _mockRouteExplorerService
                .Setup(e => e.GetRouteDescriptions())
                .Returns(new List<RouteDescriptionContract>
                {
                    new RouteDescriptionContract
                    {
                        RelativePath = "some/path"
                    }
                });

            _mockResourceLookup = new Mock<IResourceLookup>();

            _mockResourceLookup
                .Setup(r => r.GetString("index.html"))
                .Returns("<tagsoup>hello</tagsoup>");

            _mockResourceLookup
                .Setup(r => r.GetString("app.js"))
                .Returns("var x = 'y';");

            _contentController = new ContentController();

            // The ContentController class has only a default constructor to prevent IoC containers from
            // instantiating the class using a greedy strategy, ie picking the constructor with the most parameters.
            Inject(_contentController, "_routeExplorerService", _mockRouteExplorerService.Object);
            Inject(_contentController, "_resourceLookup", _mockResourceLookup.Object);
        }

        [Test]
        public void Should_Instantiate_With_Default_Constructor()
        {
            Assert.That(new ContentController(), Is.Not.Null);
        }

        [Test]
        public void Should_Get_Index_File_Content()
        {
            var response = _contentController.GetIndex();

            Assert.That(response.Content.ReadAsStringAsync().Result, Is.EqualTo("<tagsoup>hello</tagsoup>"));
        }

        [Test]
        public void Should_Get_Index_File_Content_And_Call_Resource_Lookup()
        {
            _contentController.GetIndex();

            _mockResourceLookup.Verify(r => r.GetString("index.html"));
        }

        [Test]
        public void Should_Resolve_Index_File_Content_Type()
        {
            var response = _contentController.GetIndex();

            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("text/html; charset=utf-8"));
        }

        [Test]
        public void Should_Get_File_Content()
        {
            var response = _contentController.GetFile("app.js");

            Assert.That(response.Content.ReadAsStringAsync().Result, Is.EqualTo("var x = 'y';"));
        }

        [Test]
        public void Should_Get_File_Content_And_Call_Resource_Lookup()
        {
            _contentController.GetFile("app.js");

            _mockResourceLookup.Verify(r => r.GetString("app.js"));
        }

        [Test]
        public void Should_Resolve_File_Content_Type()
        {
            var response = _contentController.GetFile("app.js");

            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/x-javascript; charset=utf-8"));
        }

        [Test]
        public void Should_Get_Route_Descriptions()
        {
            var response = _contentController.GetRouteDescriptions();

            Assert.That(response.Content.ElementAt(0).RelativePath, Is.EqualTo("some/path"));
        }

        [Test]
        public void Should_Get_Route_Descriptions_And_Return_Json_Result_With_Lower_Camel_Case()
        {
            var response = _contentController.GetRouteDescriptions();

            Assert.That(response.SerializerSettings.ContractResolver, Is.InstanceOf(typeof(CamelCasePropertyNamesContractResolver)));
        }

        [Test]
        public void Should_Get_Route_Descriptions_And_Return_Json_Result_With_Enum_Names()
        {
            var response = _contentController.GetRouteDescriptions();

            Assert.That(response.SerializerSettings.Converters[0], Is.InstanceOf(typeof(StringEnumConverter)));
        }

        private static void Inject(object obj, string fieldName, object value)
        {
            var type = obj.GetType();
            var field = type.GetField(fieldName, BindingFlags.Instance | BindingFlags.NonPublic);

            if (field != null)
            {
                field.SetValue(obj, value);
            }
        }
    }
}
