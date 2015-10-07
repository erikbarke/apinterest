using System.Net.Http;
using System.Web.Http;

namespace Apinterest.UnitTests.Mocks
{
    public class MockApiController
    {
        [Authorize]
        public string Get(string id)
        {
            return id;
        }

        public string Post(string id, [FromUri] string body)
        {
            return id;
        }

        public void Delete(int id)
        {
        }

        public HttpResponseMessage Put()
        {
            return new HttpResponseMessage();
        }
    }
}
