using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace Apinterest.DemoServer.Demo
{
    [Authorize]
    [RoutePrefix("api/attribute-routing")]
    public class AttributeRoutingController : ApiController
    {
        [HttpPost]
        [AllowAnonymous]
        [Route("movies/{id}")]
        public Movie Get(
            decimal id,
            [FromUri] Lobby lobby,
            [FromUri] int[] seats,
            [FromUri] IEnumerable<string> customers,
            [FromUri] IDictionary<int, string> keyStore,
            [FromBody] Theater theater,
            bool hasLobby,
            char rating,
            DateTime movieDate,
            TimeSpan movieLength)
        {
            return CreateMovie();
        }

        private static Movie CreateMovie()
        {
            return new Movie
            {
                Id = 12345,
                Type = MovieType.SciFi,
                MovieGoers = new Dictionary<string, MovieGoer>
                {
                    {
                        "Person 1", new MovieGoer
                        {
                            MovieType = MovieType.TwoCops,
                            Soda = true,
                            Popcorn = false,
                            Favorites = new Dictionary<string, Comment>
                            {
                                {
                                    "Big car chase movie", new Comment {Text = "Awesome, dude. Crashes and stuff."}
                                }
                            }
                        }
                    },
                    {
                        "Person 2", new MovieGoer
                        {
                            MovieType = MovieType.ChickFlick,
                            Soda = false,
                            Popcorn = true,
                            Favorites = new Dictionary<string, Comment>
                            {
                                {
                                    "Tearful goodbye", new Comment {Text = "Lik Dis If U Cry Evertim"}
                                },
                                {
                                    "Popular boy meets girl with glasses", new Comment {Text = "That was sooo meee"}
                                }
                            }
                        }
                    }
                }
            };
        }

        [HttpGet]
        [Route("movies/lobby/{id}")]
        public sbyte GetLobby(int id, [FromUri] Lobby lobby)
        {
            return -123;
        }

        [HttpGet]
        [Route("movies/really-big-document-which-might-hang-the-browser")]
        public IEnumerable<Movie> GetReallyBigDocument()
        {
            var movies = new List<Movie>();

            for (var i = 0; i < 100; i++)
            {
                movies.Add(CreateMovie());
            }

            return movies;
        }

        [HttpPost]
        [Route("movies/file-upload")]
        public async Task<IEnumerable<string>> UploadFile(int id)
        {
            var result = new List<string>();

            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            var provider = new MultipartMemoryStreamProvider();
            await Request.Content.ReadAsMultipartAsync(provider);

            foreach (var content in provider.Contents)
            {
                var name = content.Headers.ContentDisposition.FileName;
                var bytes = content.ReadAsByteArrayAsync().Result;

                result.Add("id " + id + ", file name " + name.Replace("\"", "'") + ", size " + bytes.Length + " byte(s)");
            }

            return result;
        }

        [HttpPost]
        [Route("movies/file-download")]
        public HttpResponseMessage DownLoadFile(int id)
        {
            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(Encoding.UTF8.GetBytes("Hello :)"))
            };

            result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/plain");

            return result;
        }

        [HttpPost]
        [Route("movies/post-raw-body")]
        public HttpResponseMessage PostRawBody()
        {
            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(Request.Content.ReadAsStringAsync().Result)
            };

            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            return result;
        }
    }

    public class Theater
    {
        public decimal TheaterId { get; set; }
        public MovieGoer MovieGoer { get; set; }
        public IDictionary<string, string> KeysAndValues { get; set; }
        public IDictionary<string, MovieGoer> KeysAndObjectValues { get; set; }
        public IEnumerable<MovieGoer> ListOfObjects { get; set; }
        public IEnumerable<int> ListOfNumbers { get; set; }
        public IEnumerable<bool> ListOfBooleans { get; set; }
        public IEnumerable<string> ListOfStrings { get; set; }
    }

    public enum MovieType
    {
        Comedy,
        RoadMovie,
        ChickFlick,
        Bollywood,
        Horror,
        BuddyMovie,
        TwoCops,
        SciFi
    }

    public struct MovieGoer
    {
        public MovieType MovieType { get; set; }
        public bool Popcorn { get; set; }
        public bool Soda { get; set; }
        public IDictionary<string, Comment> Favorites { get; set; }
    }

    public class Lobby
    {
        public string Location { get; set; }
        public bool PopcornVendingMachine { get; set; }
    }

    public class Comment
    {
        public string Text { get; set; }
    }

    public class Movie
    {
        public int? Id;
        public MovieType? Type { get; set; }
        public IDictionary<string, MovieGoer> MovieGoers { get; set; }
    }
}