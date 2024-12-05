using LightNap.Core.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using HtmlAgilityPack;
using static System.Net.Mime.MediaTypeNames;
using System.Text.RegularExpressions;

namespace LightNap.MaintenanceService.Tasks
{
    /// <summary>
    /// A maintenance task that purges expired refresh tokens.
    /// </summary>
    /// <param name="logger">The logger instance.</param>
    /// <param name="db">The database context.</param>
    internal class SyncClassesTask(ILogger<SyncClassesTask> logger, ApplicationDbContext db) : IMaintenanceTask
    {
        /// <summary>
        /// Gets the name of the maintenance task.
        /// </summary>
        public string Name => "Sync Classes";

        /// <summary>
        /// Runs the maintenance task asynchronously.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation.</returns>
        public async Task RunAsync()
        {
            var web = new HtmlWeb();

            const int batchSize = 100;

            int deletedCount = 0;
            int x = 0;
            while (x < 1)
            {
                var document = web.Load("https://www.washington.edu/students/timeschd/WIN2025/cse.html");
                var courses = document.DocumentNode.QuerySelectorAll("table");
                var waitingForA = false;
                var name = "";
                var courseDescription = "";
                var professorName = "";
                var slnCode = "";
                foreach ( var course in courses )
                {
                    if (course.Attributes["bgcolor"] != null && (course.Attributes["bgcolor"].Value == "#99ccff" || course.Attributes["bgcolor"].Value == "#ffcccc" || course.Attributes["bgcolor"].Value == "#ccffcc" || course.Attributes["bgcolor"].Value == "#ffffcc"))
                    {
                        var tdTags = course.QuerySelector("table").QuerySelector("tr").QuerySelectorAll("td");
                        var courseTag = tdTags.FirstOrDefault();
                        if (courseTag != null)
                        {
                            var courseTagInside = courseTag.QuerySelector("b");
                            if (courseTagInside != null)
                            {
                                var nameTag = courseTagInside.QuerySelectorAll("a").Where((tag) => tag.Attributes["name"] != null).First();
                                name = HtmlEntity.DeEntitize(nameTag.Attributes["name"].Value.ToUpper().Insert(3, " "));
                                var courseDescriptionTag = courseTagInside.QuerySelectorAll("a").Where((tag) => tag.Attributes["href"] != null).First();
                                courseDescription = HtmlEntity.DeEntitize(courseDescriptionTag.InnerText);
                            }
                        }
                        waitingForA = true;
                        continue;
                    }
                    if (waitingForA)
                    {
                        var preTags = course.QuerySelector("table").QuerySelector("tr").QuerySelector("td").QuerySelectorAll("pre");
                        var preTag = preTags.FirstOrDefault();
                        if (preTag != null)
                        {
                            var slnTag = preTag.QuerySelectorAll("a").Where((tag) => tag.Attributes["href"].Value.StartsWith("https")).First();
                            slnCode = HtmlEntity.DeEntitize(slnTag.InnerText);
                            string namePattern = @"([A-Za-z]+),\s*([A-Za-z]+)";
                            var match = Regex.Matches(HtmlEntity.DeEntitize(preTag.InnerText), namePattern);
                            if (match.Count == 0)
                            {
                                Console.WriteLine(slnCode + " " + name + ": " + courseDescription + " | UNKNOWN PROFESSOR");
                                waitingForA = false;
                                continue;
                            }
    
                            string[] nameParts = match.First().Value.Split(',');

                            string lastName = char.ToUpper(nameParts[0][0]) + nameParts[0].Substring(1).ToLower();
                            string firstName = char.ToUpper(nameParts[1][0]) + nameParts[1].Substring(1).ToLower();
                            professorName = $"{firstName} {lastName}";
                        }
                        Console.WriteLine(slnCode + " " + name + ": " + courseDescription + " | " + professorName);
                        waitingForA = false;
                        continue;
                    }
                }
                x++;
            }

            logger.LogInformation("Deleted {deletedCount} expired refresh tokens", deletedCount);

            // It's possible that some may have been created since we started.
            logger.LogInformation("Finished with {count} refresh tokens", await db.RefreshTokens.CountAsync());
        }
    }
}
