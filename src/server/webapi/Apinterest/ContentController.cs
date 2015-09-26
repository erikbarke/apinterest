using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Text;
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
        private readonly Dictionary<string, string> _mediaTypeMappings;
        private readonly IRouteExplorerService _apiExplorerService;
        private readonly IResourceLookup _resourceLookup;
        private readonly JsonSerializerSettings _jsonSerializerSettings;

        public ContentController()
        {
            var validatorFactory = new ValidatorFactory();
            var timeMachine = new TimeMachine();
            var logger = LogManager.GetLogger("Apinterest");
            var sampleFactory = new SampleFactory(validatorFactory, timeMachine, logger);

            _apiExplorerService = new RouteExplorerService(GlobalConfiguration.Configuration.Services.GetApiExplorer(), sampleFactory);
            _resourceLookup = new ResourceLookup(Assembly.GetExecutingAssembly());

            _mediaTypeMappings = new Dictionary<string, string>
            {
                { ".css", "text/css" },
                { ".html", "text/html" },
                { ".js", "application/javascript" }
            };

            _jsonSerializerSettings = new JsonSerializerSettings()
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                Converters = new JsonConverter[] { new StringEnumConverter() }
            };
        }

        [HttpGet]
        [Route("apinterest/route-descriptions")]
        public JsonResult<IEnumerable<RouteDescriptionContract>> GetRouteDescriptions()
        {
            return Json(_apiExplorerService.GetRouteDescriptions(), _jsonSerializerSettings);
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

        private HttpResponseMessage CreateStringResponse(string file)
        {
            var mediaType = ResolveMediaType(file);

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(_resourceLookup.GetString(file), Encoding.UTF8, mediaType)
            };
        }

        private string ResolveMediaType(string file)
        {
            var extension = Path.GetExtension(file);

            if (extension != null && _mediaTypeMappings.ContainsKey(extension))
            {
                return _mediaTypeMappings[extension];
            }

            return "";
        }
    }
}