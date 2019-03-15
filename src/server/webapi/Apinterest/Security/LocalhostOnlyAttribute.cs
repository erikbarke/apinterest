using System.Web.Http;
using System.Web.Http.Controllers;

namespace Apinterest.Security
{
    public class LocalhostOnlyAttribute : AuthorizeAttribute
    {
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            return actionContext.RequestContext.IsLocal;
        }
    }
}
