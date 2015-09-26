using System.Collections.Generic;

namespace Apinterest.Contracts
{
    public class RouteDescriptionContract
    {
        public RouteDescriptionContract()
        {
            Details = new List<RouteDetailContract>();
            Parameters = new List<ParameterContract>();
        }

        public string Id { get; set; }
        public string RelativePath { get; set; }
        public string HttpMethod { get; set; }
        public bool RequiresAuthorization { get; set; }
        public IEnumerable<RouteDetailContract> Details { get; set; }
        public IEnumerable<ParameterContract> Parameters { get; set; }
        public ResponseContract Response { get; set; }
    }
}
