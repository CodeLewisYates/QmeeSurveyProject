const {getAverages, getStats, logResults} = require("./helpers");

const init = async () => {
  const surveyResults = await getAverages();
  const surveysStats = getStats(surveyResults);
  logResults(surveyResults, surveysStats);
};

init();