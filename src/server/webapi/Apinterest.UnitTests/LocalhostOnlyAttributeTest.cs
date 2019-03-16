using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Routing;
using Apinterest.Security;
using Apinterest.UnitTests.Mocks;
using Moq;
using NUnit.Framework;

namespace Apinterest.UnitTests
{
    [TestFixture]
    public class LocalhostOnlyAttributeTest
    {
        private HttpControllerContext _httpControllerContext;
        private Mock<HttpActionDescriptor> _mockHttpActionDescriptor;

        [SetUp]
        public void Setup()
        {
            var config = new HttpConfiguration();
            var route = new HttpRouteData(new HttpRoute());
            var request = new HttpRequestMessage();

            _httpControllerContext = new HttpControllerContext(config, route, request)
            {
                ControllerDescriptor = new HttpControllerDescriptor(config, "", typeof(MockController))
            };

            _mockHttpActionDescriptor = new Mock<HttpActionDescriptor>
            {
                CallBase = true
            };
        }

        [Test]
        public void Should_Authorize_Local_Requests()
        {
            var attribute = new LocalhostOnlyAttribute();
            var context = new HttpActionContext(_httpControllerContext, _mockHttpActionDescriptor.Object);

            _httpControllerContext.RequestContext.IsLocal = true;

            attribute.OnAuthorization(context);

            //Assert.That(_httpControllerContext.RequestContext, Is.True);
        }
    }
}
