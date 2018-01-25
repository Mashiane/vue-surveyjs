import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import SurveyDetails from '../components/SurveyDetails.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { showBackButton: false, showFabCreate: true }
    },
    {
        path: '/surveyDetails/:surveyId',
        name: 'Survey Details',
        component: SurveyDetails,
        meta: { showBackButton: true }
      }
  ]
})