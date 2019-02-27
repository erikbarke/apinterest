using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Description;
using Apinterest.Contracts;
using Apinterest.Samples;

namespace Apinterest
{
    public class RouteExplorerService : IRouteExplorerService
    {
        private readonly IApiExplorer _apiExplorer;
        private readonly ISampleFactory _sampleFactory;

        public RouteExplorerService(IApiExplorer apiExplorer, ISampleFactory sampleFactory)
        {
            _apiExplorer = apiExplorer;
            _sampleFactory = sampleFactory;
        }

        public IEnumerable<RouteDescriptionContract> GetRouteDescriptions()
        {
            var apiDescriptions = _apiExplorer
                .ApiDescriptions
                .Where(d => !string.IsNullOrWhiteSpace(d.RelativePath))
                .OrderBy(d => d.RelativePath);

            var contracts = new List<RouteDescriptionContract>();

            foreach (var apiDescription in apiDescriptions)
            {
                var routeDescriptionContract = new RouteDescriptionContract
                {
                    Id = apiDescription.ID,
                    RelativePath = apiDescription.RelativePath,
                    HttpMethod = apiDescription.HttpMethod.Method,
                    RequiresAuthorization = GetRequiresAuthorization(apiDescription),
                    Details = GetRouteDetails(apiDescription),
                    Parameters = GetParameterDescriptions(apiDescription),
                    Response = GetResponse(apiDescription)
                };

                contracts.Add(routeDescriptionContract);
            }

            return contracts;
        }

        private static bool GetRequiresAuthorization(ApiDescription apiDescription)
        {
            var attributes = new HashSet<Attribute>();

            attributes.UnionWith(apiDescription.ActionDescriptor.GetCustomAttributes<AuthorizeAttribute>());
            attributes.UnionWith(apiDescription.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>());
            attributes.UnionWith(apiDescription.ActionDescriptor.ControllerDescriptor.GetCustomAttributes<AuthorizeAttribute>());
            attributes.UnionWith(apiDescription.ActionDescriptor.ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>());

            return attributes.Any(a => a is AuthorizeAttribute) && !attributes.Any(a => a is AllowAnonymousAttribute);
        }

        private static IEnumerable<RouteDetailContract> GetRouteDetails(ApiDescription apiDescription)
        {
            var methodInfo = GetMethodInfo(apiDescription);

            return new List<RouteDetailContract>
            {
                new RouteDetailContract
                {
                    Header = "Assembly", Description = GetAssembly(methodInfo)
                },
                new RouteDetailContract
                {
                    Header = "Controller", Description = GetController(methodInfo)
                },
                new RouteDetailContract
                {
                    Header = "Code method", Description = GetMethod(methodInfo)
                }
            };
        }

        private static MethodInfo GetMethodInfo(ApiDescription apiDescription)
        {
            return apiDescription.ActionDescriptor is ReflectedHttpActionDescriptor actionDescriptor ? actionDescriptor.MethodInfo : null;
        }

        private static string GetAssembly(MethodInfo methodInfo)
        {
            return methodInfo == null ? "No assembly info found" : methodInfo.Module.Name;
        }

        private static string GetController(MethodInfo methodInfo)
        {
            return (methodInfo != null && methodInfo.DeclaringType != null)
                ? methodInfo.DeclaringType.ToString() : "No controller info found";
        }

        private static string GetMethod(MethodInfo methodInfo)
        {
            return methodInfo == null ? "No controller method info found" : methodInfo.Name;
        }

        private IEnumerable<ParameterContract> GetParameterDescriptions(ApiDescription apiDescription)
        {
            var parameters = new List<ParameterContract>();

            foreach (var apiParameterDescription in apiDescription.ParameterDescriptions)
            {
                if (apiParameterDescription.ParameterDescriptor != null)
                {
                    var sample = _sampleFactory.CreateSample(apiParameterDescription.ParameterDescriptor.ParameterType);

                    parameters.Add(new ParameterContract
                    {
                        Source = apiParameterDescription.Source.ToString(),
                        Name = apiParameterDescription.Name,
                        Type = apiParameterDescription.ParameterDescriptor.ParameterType.ToString(),
                        Category = sample.Category,
                        Sample = sample.Instance,
                        Validators = MapValidators(sample)
                    });
                }
            }

            AddRawBodyParameter(apiDescription, parameters);

            return parameters;
        }

        private static void AddRawBodyParameter(ApiDescription apiDescription, List<ParameterContract> parameters)
        {
            if ((apiDescription.HttpMethod == HttpMethod.Post || apiDescription.HttpMethod == HttpMethod.Put) &&
                parameters.All(p => p.Source != ApiParameterSource.FromBody.ToString()))
            {
                parameters.Add(new ParameterContract
                {
                    Source = ApiParameterSource.FromBody.ToString(),
                    Name = "body",
                    Type = typeof(string).ToString(),
                    Category = "object",
                    Sample = new Dictionary<string, string> {{"property", "value"}},
                    Validators = new List<ValidatorContract>()
                });
            }
        }

        private ResponseContract GetResponse(ApiDescription apiDescription)
        {
            if (apiDescription.ResponseDescription.DeclaredType == null)
            {
                return new ResponseContract();
            }

            if (apiDescription.ResponseDescription.DeclaredType == typeof(HttpResponseMessage))
            {
                return new ResponseContract
                {
                    Type = apiDescription.ResponseDescription.DeclaredType.ToString(),
                    Sample = "\"Hello world!\""
                };
            }

            var sample = _sampleFactory.CreateSample(apiDescription.ResponseDescription.DeclaredType);

            return new ResponseContract
            {
                Type = apiDescription.ResponseDescription.DeclaredType.ToString(),
                Category = sample.Category,
                Sample = sample.Instance,
                Validators = MapValidators(sample)
            };
        }

        private static IEnumerable<ValidatorContract> MapValidators(Sample sample)
        {
            return sample.Validators.Select(v => new ValidatorContract
            {
                Type = v.Type,
                Category = v.Category,
                Path = v.Path,
                Pattern = v.Pattern,
                FriendlyPattern = v.FriendlyPattern,
                MinValue = v.MinValue,
                MaxValue = v.MaxValue,
                Values = v.Values
            });
        }
    }
}
