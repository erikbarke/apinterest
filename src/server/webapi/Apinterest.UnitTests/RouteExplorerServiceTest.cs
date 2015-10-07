using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Description;
using Moq;
using NUnit.Framework;
using Apinterest.Contracts;
using Apinterest.Samples;
using Apinterest.UnitTests.Mocks;
using Apinterest.Validation;

namespace Apinterest.UnitTests
{
    [TestFixture]
    public class RouteExplorerServiceTest
    {
        private Mock<IApiExplorer> _mockApiExplorer;
        private Mock<ISampleFactory> _mockSampleFactory;
        private IEnumerable<RouteDescriptionContract> _routeDescriptionContracts;

        [SetUp]
        public void SetUp()
        {
            _mockApiExplorer = new Mock<IApiExplorer>();
            _mockApiExplorer
                .Setup(m => m.ApiDescriptions)
                .Returns(CreateMockRouteDescriptions());

            _mockSampleFactory = new Mock<ISampleFactory>();
            _mockSampleFactory
                .Setup(f => f.CreateSample(It.IsAny<Type>()))
                .Returns(new Sample("abc123", "simple", new List<Validator>()));

            var routeExplorerService = new RouteExplorerService(_mockApiExplorer.Object, _mockSampleFactory.Object);
            _routeDescriptionContracts = routeExplorerService.GetRouteDescriptions();
        }

        [Test]
        public void Should_Return_List_Of_Route_Description_Models()
        {
            Assert.That(_routeDescriptionContracts, Is.Not.Null);
        }

        [Test]
        public void Should_Sort_List_Of_Route_Description_Models_Alphabetically()
        {
            Assert.That(_routeDescriptionContracts.ElementAt(0).RelativePath == "apinterest/a/GET/with/return/type");
            Assert.That(_routeDescriptionContracts.ElementAt(1).RelativePath == "apinterest/b/POST/with/return/type");
            Assert.That(_routeDescriptionContracts.ElementAt(2).RelativePath == "apinterest/c/DELETE/with/void/return");
            Assert.That(_routeDescriptionContracts.ElementAt(3).RelativePath == "apinterest/d/PUT/with/return/type");
        }

        [Test]
        public void Should_Set_Http_Method_For_GET_Route()
        {
            Assert.That(_routeDescriptionContracts.ElementAt(0).HttpMethod, Is.EqualTo("GET"));
        }

        [Test]
        public void Should_Set_Http_Method_For_POST_Route()
        {
            Assert.That(_routeDescriptionContracts.ElementAt(1).HttpMethod, Is.EqualTo("POST"));
        }

        [Test]
        public void Should_Set_Requires_Authorization_For_GET_Route()
        {
            Assert.That(_routeDescriptionContracts.ElementAt(0).RequiresAuthorization, Is.True);
        }

        [Test]
        public void Should_Set_Requires_Authorization_For_POST_Route()
        {
            Assert.That(_routeDescriptionContracts.ElementAt(1).RequiresAuthorization, Is.False);
        }

        [Test]
        public void Should_Set_Assembly_For_GET_Route()
        {
            var routeDescription = _routeDescriptionContracts.ElementAt(0);
            var detail = routeDescription.Details.Single(d => d.Header == "Assembly");

            Assert.That(detail.Description, Is.EqualTo("Apinterest.UnitTests.dll"));
        }

        [Test]
        public void Should_Set_Assembly_For_POST_Route()
        {
            var routeDescription = _routeDescriptionContracts.ElementAt(1);
            var detail = routeDescription.Details.Single(d => d.Header == "Assembly");

            Assert.That(detail.Description, Is.EqualTo("Apinterest.UnitTests.dll"));
        }

        [Test]
        public void Should_Set_Controller_For_GET_Route()
        {
            var routeDescription = _routeDescriptionContracts.ElementAt(0);
            var detail = routeDescription.Details.Single(d => d.Header == "Controller");
            
            Assert.That(detail.Description, Is.EqualTo("Apinterest.UnitTests.Mocks.MockApiController"));
        }

        [Test]
        public void Should_Set_Controller_For_POST_Route()
        {
            var routeDescription = _routeDescriptionContracts.ElementAt(1);
            var detail = routeDescription.Details.Single(d => d.Header == "Controller");
            
            Assert.That(detail.Description, Is.EqualTo("Apinterest.UnitTests.Mocks.MockApiController"));
        }

        [Test]
        public void Should_Set_Method_For_GET_Route()
        {
            var routeDescription = _routeDescriptionContracts.ElementAt(0);
            var detail = routeDescription.Details.Single(d => d.Header == "Code method");

            Assert.That(detail.Description == "Get");
        }

        [Test]
        public void Should_Set_Method_For_POST_Route()
        {
            var routeDescription = _routeDescriptionContracts.ElementAt(1);
            var detail = routeDescription.Details.Single(d => d.Header == "Code method");

            Assert.That(detail.Description, Is.EqualTo("Post"));
        }

        private static Collection<ApiDescription> CreateMockRouteDescriptions()
        {
            return new Collection<ApiDescription>
            {
                CreateApiDescriptionWithPOSTAndReturnType(),
                CreateApiDescriptionWithDELETEAndVoidReturn(),
                CreateApiDescriptionWithGETAndReturnType(),
                CreateApiDescriptionWithPUTAndReturnType()
            };
        }

        private static ApiDescription CreateApiDescriptionWithGETAndReturnType()
        {
            var mockApiDescription = CreateApiDescription("apinterest/a/GET/with/return/type", HttpMethod.Get, "Get", typeof(string));

            var parameters = ((ReflectedHttpActionDescriptor)mockApiDescription.ActionDescriptor).MethodInfo.GetParameters();

            mockApiDescription.ParameterDescriptions.Add(new ApiParameterDescription
            {
                Source = ApiParameterSource.FromUri,
                Name = parameters[0].Name,
                ParameterDescriptor = new ReflectedHttpParameterDescriptor(new ReflectedHttpActionDescriptor
                {
                    Configuration = new HttpConfiguration()
                }, parameters[0]),
                
            });

            return mockApiDescription;
        }

        private static ApiDescription CreateApiDescriptionWithPOSTAndReturnType()
        {
            return CreateApiDescription("apinterest/b/POST/with/return/type", HttpMethod.Post, "Post", typeof(string));
        }

        private static ApiDescription CreateApiDescriptionWithDELETEAndVoidReturn()
        {
            return CreateApiDescription("apinterest/c/DELETE/with/void/return", HttpMethod.Delete, "Delete", null);
        }

        private static ApiDescription CreateApiDescriptionWithPUTAndReturnType()
        {
            return CreateApiDescription("apinterest/d/PUT/with/return/type", HttpMethod.Put, "Put", typeof(HttpResponseMessage));
        }

        private static ApiDescription CreateApiDescription(string relativePath, HttpMethod httpMethod, string codeMethod, Type responseType)
        {
            var mockApiControllerType = typeof(MockApiController);

            var mockApiDescription = new ApiDescription
            {
                RelativePath = relativePath,
                HttpMethod = httpMethod,
                ActionDescriptor = new ReflectedHttpActionDescriptor
                {
                    ControllerDescriptor = new HttpControllerDescriptor
                    {
                        Configuration = new HttpConfiguration(),
                        ControllerName = "MockApiController",
                        ControllerType = typeof(MockApiController)
                    },
                    MethodInfo = mockApiControllerType.GetMethod(codeMethod)
                }
            };

            var responseDescription = new ResponseDescription
            {
                DeclaredType = responseType
            };

            SetInternalProperty(mockApiDescription, responseDescription);

            return mockApiDescription;
        }

        private static void SetInternalProperty(ApiDescription mockApiDescription, ResponseDescription responseDescription)
        {
            var type = mockApiDescription.GetType();
            var responseDescriptionProperty = type.GetProperty("ResponseDescription");

            responseDescriptionProperty.SetValue(mockApiDescription, responseDescription);
        }
    }
}
