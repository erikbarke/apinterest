using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Http.Results;
using Apinterest.Contracts;
using Apinterest.Resources;
using Apinterest.Samples;
using Apinterest.Time;
using Apinterest.Validation;
using log4net;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace Apinterest
{
    [LocalhostOnly]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class ContentController : ApiController
    {
        private static readonly JsonSerializerSettings JsonSerializerSettings = new JsonSerializerSettings()
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            Converters = new JsonConverter[] { new StringEnumConverter() }
        };

        private readonly IRouteExplorerService _routeExplorerService;
        private readonly IResourceLookup _resourceLookup;

        public ContentController()
        {
            var validatorFactory = new ValidatorFactory();
            var timeMachine = new TimeMachine();
            var logger = LogManager.GetLogger("Apinterest");
            var sampleFactory = new SampleFactory(validatorFactory, timeMachine, logger);

            _routeExplorerService = new RouteExplorerService(GlobalConfiguration.Configuration.Services.GetApiExplorer(), sampleFactory);
            _resourceLookup = new ResourceLookup(Assembly.GetExecutingAssembly());
        }

        public ContentController(IRouteExplorerService routeExplorerService, IResourceLookup resourceLookup)
        {
            _routeExplorerService = routeExplorerService;
            _resourceLookup = resourceLookup;
        }

        [HttpGet]
        [Route("apinterest")]
        public HttpResponseMessage GetIndex()
        {
            return CreateStringResponse("index.html");
        }

        [HttpGet]
        [Route("apinterest/content/{*file}")]
        public HttpResponseMessage GetFile(string file)
        {
            return CreateStringResponse(file);
        }

        [HttpGet]
        [Route("apinterest/route-descriptions")]
        public JsonResult<IEnumerable<RouteDescriptionContract>> GetRouteDescriptions()
        {
            return Json(_routeExplorerService.GetRouteDescriptions(), JsonSerializerSettings);
        }

        private HttpResponseMessage CreateStringResponse(string file)
        {
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(_resourceLookup.GetString(file), Encoding.UTF8, MimeMapping.GetMimeMapping(file))
            };
        }
    }
}