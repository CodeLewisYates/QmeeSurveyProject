const axios = require("axios");
const fs = require("fs");

const init = async () => {
    const surveyResults = await getAverages();
    const surveysStats = getStats(surveyResults);
    logResults(surveyResults, surveysStats);
}

const getAverages = async () => {
    // getSurveys(number of surveys to retrieve from endpoint)
    const surveys = await getSurveys(15);

    let surveyData = {};
    surveys.forEach((survey) => {
        const timeTakenForSurvey = Math.ceil((new Date(survey.endTime) - new Date(survey.startTime)) / (1000 * 60));

        const surveyId = survey.surveyId;
        surveyData[surveyId] ? surveyData[surveyId] = {count: surveyData[surveyId].count + 1, addedTimes: surveyData[surveyId].addedTimes + timeTakenForSurvey} 
        : surveyData[surveyId] = {count: 1, addedTimes: timeTakenForSurvey}
    });

    const surveyResults = [];
    Object.keys(surveyData).forEach(key => {
        surveyResults.push({surveyId: +key, averageTime: Math.round(surveyData[key].addedTimes / surveyData[key].count), timesTaken: surveyData[key].count});
    });

    return surveyResults;
}

const getSurveys = async (count) => {
    const promises = [];
    for(let i = 0; i < count; i++){
        const response = axios.get("https://qmee-tech-test.herokuapp.com/survey-completed-event");
        promises.push(response);
    }
    let surveys = await Promise.all(promises);
    surveys = surveys.map(survey => survey.data);

    return surveys;
}

const logResults = (results, stats) => {
    // log results
    let data = "";
    results.forEach(result => {
        data += `Survey ID: ${result.surveyId}\nAverage completion time: ${result.averageTime} minutes\nTimes Completed: ${result.timesTaken}\n\n`
    });
    data += stats;
    fs.writeFileSync("./Survey Results", data);
    console.log("Successfully saved results into file")
}

// BONUS
const getStats = (surveys) => {
    let mostPopularSurvey = {timesTaken: 1};
    let leastPopularSurvey = {timesTaken: Infinity};
    surveys.forEach(survey => {
        if(survey.timesTaken > mostPopularSurvey.timesTaken) mostPopularSurvey = survey;
        if(survey.timesTaken < leastPopularSurvey.timesTaken) leastPopularSurvey = survey;
    });

    let longestSurvey = {averageTime: 1};
    let shortestSurvey = {averageTime: Infinity};
    surveys.forEach(survey => {
        if(survey.averageTime > longestSurvey.averageTime) longestSurvey = survey;
        if(survey.averageTime < shortestSurvey.averageTime) shortestSurvey = survey;
    });

    return `Most Popular Survey: SurveyID ${mostPopularSurvey.surveyId}\nLeast Popular Survey: SurveyID ${leastPopularSurvey.surveyId}\nLongest Survey: SurveyID ${longestSurvey.surveyId}\nShortest Survey: SurveyID ${shortestSurvey.surveyId}\n`
}

init();

module.exports = {getSurveys, getAverages}