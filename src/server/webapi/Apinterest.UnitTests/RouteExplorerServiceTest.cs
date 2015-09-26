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
            Assert.That(_routeDescriptionContracts.ElementAt(0).RelativePath == "apinterest/a");
            Assert.That(_routeDescriptionContracts.ElementAt(1).RelativePath == "apinterest/b");
        }

        [Test]
        public void Should_Set_Http_Method_For_Path_A()
        {
            Assert.That(_routeDescriptionContracts.ElementAt(0).HttpMethod, Is.EqualTo("GET"));
        }

        [Test]
        public void Should_Set_Http_Method_For_Path_B()
        {
            Assert.That(_routeDescriptionContracts.ElementAt(1).HttpMethod, Is.EqualTo("POST"));
        }

        [Test]
        public void Should_Set_Requires_Authorization_For_Path_A()
        {
            Assert.That(_routeDescriptionContracts.ElementAt(0).RequiresAuthorization, Is.True);
        }

        [Test]
        public void Should_Set_Requires_Authorization_For_Path_B()
        {
            Assert.That(_routeDescriptionContracts.ElementAt(1).RequiresAuthorization, Is.False);
        }

        [Test]
        public void Should_Set_Assembly_For_Path_A()
        {
            var routeDescription = _routeDescriptionContracts.ElementAt(0);
            var detail = routeDescription.Details.Single(d => d.Header == "Assembly");

            Assert.That(detail.Description, Is.EqualTo("Apinterest.UnitTests.dll"));
        }

        [Test]
        public void Should_Set_Assembly_For_Path_B()
        {
            var routeDescription = _routeDescriptionContracts.ElementAt(1);
            var detail = routeDescription.Details.Single(d => d.Header == "Assembly");

            Assert.That(detail.Description, Is.EqualTo("Apinterest.UnitTests.dll"));
        }

        [Test]
        public void Should_Set_Controller_For_Path_A()
        {
            var routeDescription = _routeDescriptionContracts.ElementAt(0);
            var detail = routeDescription.Details.Single(d => d.Header == "Controller");
            
            Assert.That(detail.Description, Is.EqualTo("Apinterest.UnitTests.Mocks.MockApiController"));
        }

        [Test]
        public void Should_Set_Controller_For_Path_B()
        {
            var routeDescription = _routeDescriptionContracts.ElementAt(1);
            var detail = routeDescription.Details.Single(d => d.Header == "Controller");
            
            Assert.That(detail.Description, Is.EqualTo("Apinterest.UnitTests.Mocks.MockApiController"));
        }

        [Test]
        public void Should_Set_Method_For_Path_A()
        {
            var routeDescription = _routeDescriptionContracts.ElementAt(0);
            var detail = routeDescription.Details.Single(d => d.Header == "Code method");

            Assert.That(detail.Description == "Get");
        }

        [Test]
        public void Should_Set_Method_For_Path_B()
        {
            var routeDescription = _routeDescriptionContracts.ElementAt(1);
            var detail = routeDescription.Details.Single(d => d.Header == "Code method");

            Assert.That(detail.Description, Is.EqualTo("Post"));
        }

        private static Collection<ApiDescription> CreateMockRouteDescriptions()
        {
            return new Collection<ApiDescription>
            {
                CreateApiDescriptionB(),
                CreateApiDescriptionA()
            };
        }

        private static ApiDescription CreateApiDescriptionA()
        {
            var mockApiControllerType = typeof(MockApiController);
            var methodInfo = mockApiControllerType.GetMethod("Get");
            var parameters = methodInfo.GetParameters();

            var mockApiDescription = new ApiDescription
            {
                RelativePath = "apinterest/a",
                HttpMethod = HttpMethod.Get,
                ActionDescriptor = new ReflectedHttpActionDescriptor
                {
                    ControllerDescriptor = new HttpControllerDescriptor
                    {
                        Configuration = new HttpConfiguration(),
                        ControllerName = "MockApiController",
                        ControllerType = typeof (MockApiController)
                    },
                    MethodInfo = methodInfo
                }
            };

            mockApiDescription.ParameterDescriptions.Add(new ApiParameterDescription
            {
                Source = ApiParameterSource.FromUri,
                Name = parameters[0].Name,
                ParameterDescriptor = new ReflectedHttpParameterDescriptor(new ReflectedHttpActionDescriptor
                {
                    Configuration = new HttpConfiguration()
                }, parameters[0]),
                
            });

            var responseDescription = new ResponseDescription
            {
                DeclaredType = typeof(string)
            };

            SetInternalProperty(mockApiDescription, responseDescription);

            return mockApiDescription;
        }

        private static ApiDescription CreateApiDescriptionB()
        {
            var mockApiControllerType = typeof(MockApiController);

            var mockApiDescription = new ApiDescription
            {
                RelativePath = "apinterest/b",
                HttpMethod = HttpMethod.Post,
                ActionDescriptor = new ReflectedHttpActionDescriptor
                {
                    ControllerDescriptor = new HttpControllerDescriptor
                    {
                        Configuration = new HttpConfiguration(),
                        ControllerName = "MockApiController",
                        ControllerType = typeof(MockApiController)
                    },
                    MethodInfo = mockApiControllerType.GetMethod("Post")
                }
            };

            var responseDescription = new ResponseDescription
            {
                DeclaredType = typeof(string)
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
