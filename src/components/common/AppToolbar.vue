<template>
    <v-toolbar class="teal accent-3">
        <v-btn v-if="showBackButton()" icon @click.native.stop="onClickBackButton()">
            <v-icon class="white--text">arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title class="white--text">Vue.js & Survey.js</v-toolbar-title>
        <v-fab-transition>
            <v-btn v-if="showFabCreate()" fab small color="red darken-1" bottom right absolute @click.native.stop="onClickCreateSurvey()">
                <v-icon class="white--text">add</v-icon>
            </v-btn>
        </v-fab-transition>
        <v-fab-transition>
            <v-btn v-if="showFabResults()" fab small color="red darken-1" bottom right absolute @click.native.stop="onClickGetSurveyResults()">
                <v-icon class="white--text">description</v-icon>
            </v-btn>
        </v-fab-transition>
        <v-speed-dial v-model="fab" v-if="showSpeedDial()" bottom right absolute direction="bottom" transition="slide-y-reverse-transition">
            <v-btn slot="activator" color="red darken-1" dark fab small v-model="fab">
                <v-icon>arrow_drop_down</v-icon>
                <v-icon>close</v-icon>
            </v-btn>
            <v-btn fab dark small color="red darken-1" @click.native.stop="showCharts()">
                <v-icon>poll</v-icon>
            </v-btn>
            <v-btn fab dark small color="red darken-1" @click.native.stop="makeSurveyResultsPublic()">
                <v-icon>http</v-icon>
            </v-btn>
            <v-btn fab dark small color="red darken-1" @click.native.stop="downloadResults()">
                <v-icon>file_download</v-icon>
            </v-btn>
        </v-speed-dial>
        <app-dialog></app-dialog>
    </v-toolbar>
</template>

<script lang="ts">

import Vue from 'vue';
import Component from 'vue-class-component';
import AppDialog from './AppDialog.vue';
import EventBus from '../../event.bus';
import { State } from 'vuex-class';
import { SurveyModel, SurveyResultsModel } from '../../types';
import { Utils }  from '../../utils/utils';
import * as papa from 'papaparse';

@Component({
  components: {
    // Add a reference to the component in the components property.
    AppDialog
  }
})
export default class Toolbar extends Vue {

    fab: boolean = false;
    @State('selectedSurvey') selectedSurvey: any;
    @State('surveyResults') surveyResults: any;
    @State('results') results: any;
    keys: any = [];
    chartData: any = [];
    utils: any;

    constructor() {
        super();
        this.utils = new Utils();
    }

    showBackButton() {
        return this.$route.meta.showBackButton;
    }

    showFabCreate() {
        return this.$route.meta.showFabCreate;
    }

    showFabResults() {
        return this.$route.meta.showFabResults;
    }

    showSpeedDial() {
        return this.$route.meta.showSpeedDial;
    }

    onClickCreateSurvey() {
        EventBus.$emit('SHOW_DIALOG', {title: "Create Survey", message: "¿Are you sure to create new survey?", action: "create", simpleDialog: true});
    }

    onClickGetSurveyResults() {
        //console.log(this.$route.params.surveyId);
        this.$router.push({ path: '/surveyResults' });
        // this.$router.push({ path: `/surveyResults/${this.$route.params.surveyId}` });
    }

    onClickBackButton() {
        this.$router.go(-1);
    }

    showCharts() {
        EventBus.$emit('SHOW_DIALOG', {title: "Charts", action: "charts", fullscreen: true, chartsDialog: true});
    }

    makeSurveyResultsPublic() {
        let title = 'Grant Access';
        let message = 'Your Survey results can be accessible via direct Url. ¿Are you sure to grant access?';
        if (this.selectedSurvey.AllowAccessResult) {
            title = 'Disable Access';
            message = 'Your Survey results can not be accessible via direct Url. ¿Are you sure to disable access?';
        }
        EventBus.$emit('SHOW_DIALOG', {title: title, message: message, action: "makePublic", survey: this.selectedSurvey, simpleDialog: true});
    }

    downloadResults() {
        this.keys = this.utils.getKeys(this.surveyResults);
        let args = [this.results, this.surveyResults];
        this.chartData = this.utils.formatDataChart(...args);

        let csv = papa.unparse({
			fields: this.keys,
			data: this.chartData
        });
	   
        // Dummy implementation for Desktop download purpose.
        // Sent the UTF-8 header for the download process.
        let blob = new Blob(["\ufeff", csv]);
        let a = window.document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = "survey-results.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};
</script>
<style>
    .speed-dial--bottom.speed-dial--absolute {
        bottom: 0;
    }
    .speed-dial--right {
        right: 8px;
    }
</style>