import { GetterTree, ActionTree, MutationTree, Mutation } from 'vuex';
import { State, SurveyModel, SurveyResultsModel } from '../types';
import { surveyService } from '../services/survey.service';

const state: State = {
    activeSurveys: [],
    archiveSurveys: [],
    surveyResults: []
}

const getters: GetterTree<State, any> = {
    activeSurveys: state => state.activeSurveys,
    archiveSurveys: state => state.archiveSurveys
}

const actions: ActionTree<State, any> = {
    /*
    FETCH_ACTIVE_SURVEYS: function({ commit }) {
        surveyService.getActiveSurveys()
        .then((response) => {
            commit("FETCH_ACTIVE_SURVEYS_MUTATION", response.data);
        })
        .catch((error => {
            console.log(error.statusText)
        }))
    },
    FETCH_ARCHIVE_SURVEYS: function({ commit }) {
        surveyService.getArchiveSurveys()
        .then((response) => {
            commit("FETCH_ARCHIVE_SURVEYS_MUTATION", response.data);
        })
        .catch((error => {
            console.log(error.statusText)
        }))
    },
    */
    FETCH_SURVEYS: function({commit}, {self}) {
        Promise.all([
            surveyService.getActiveSurveys(),
            surveyService.getArchiveSurveys()
          ]).then(response => {
            //console.log(response);
            self.hiddenProgress();
            commit("FETCH_SURVEYS_MUTATION", response);
          }).catch(err => {
            self.hiddenProgress();
            console.log(err.message);
          });
    },
    CREATE_SURVEY: function({commit}) {
        surveyService.createSurvey("New Survey :)")
        .then((response) => {
            commit("CREATE_SURVEY_MUTATION", response.data);
        })
        .catch((error => {
            console.log(error.statusText)
        }))
    },
    FETCH_SURVEY_RESULTS: function({ commit }, {idSurvey, self}) {
        surveyService.getSurveyResults(idSurvey)
        .then((response) => {
            self.hiddenProgress();
            commit("FETCH_SURVEY_RESULTS_MUTATION", response.data);
        })
        .catch((error => {
            self.hiddenProgress();
            console.log(error.statusText)
        }))
    },
}

const mutations: MutationTree<State> = {
    /*
    FETCH_ACTIVE_SURVEYS_MUTATION(state, activeSurveys) {
        state.activeSurveys = activeSurveys
    },
    FETCH_ARCHIVE_SURVEYS_MUTATION(state, archiveSurveys) {
        state.archiveSurveys = archiveSurveys
    },
    */
    FETCH_SURVEYS_MUTATION(state, surveys) {
        state.activeSurveys = SurveyModel.fromJSONArray(surveys[0].data);
        state.archiveSurveys = SurveyModel.fromJSONArray(surveys[1].data);
    },
    CREATE_SURVEY_MUTATION(state, survey) {
        state.activeSurveys.unshift(survey);
    },
    FETCH_SURVEY_RESULTS_MUTATION(state, results) {
        state.surveyResults = SurveyResultsModel.fromJSONArray(results.Data);
    },
}

export const surveys = {
    state,
    getters,
    actions, 
    mutations
} 

