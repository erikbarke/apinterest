using System.Collections.Generic;
using Apinterest.Contracts;

namespace Apinterest
{
    public interface IRouteExplorerService
    {
        IEnumerable<RouteDescriptionContract> GetRouteDescriptions();
    }
}
