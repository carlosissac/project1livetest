let apiHandler = {

    addressAPIResp : "",
    countyAPIResp : "",
    localAPIResp : "", 
    stateAPIResp : "",
    federalAPIResp : "",
    keySmarty : "",
    appIDSmarty : "",
    authTokenSmarty : "",
    appIDGoogle : "",
    du : dynamicUi, 

    loadApiKeys: function () {
        //this.keySmarty = `3738003473505566`;
        this.appIDSmarty = JSON.parse(localStorage.getItem("appIDSmartyStreets"));
        this.authTokenSmarty = JSON.parse(localStorage.getItem("authTokenSmartyStreets"));
        this.appKeyGoogle = JSON.parse(localStorage.getItem("appKeyGoogle"));
    },

    async addressResolve() {
        let keyS = this.keySmarty;
        let add1 = JSON.parse(localStorage.getItem("add1"));
        let add2 = JSON.parse(localStorage.getItem("add2"));
        let city = JSON.parse(localStorage.getItem("city"));
        let state = JSON.parse(localStorage.getItem("state"));
        let zip = JSON.parse(localStorage.getItem("zip"));

        //Host URL 
        //let queryURL = `https://us-street.api.smartystreets.com/street-address?auth-id=${this.appIDSmarty}&auth-token=${this.authTokenSmarty}&candidates=1&match=invalid&street=${add1}&street2=${add2}&city=${city}&state=${state}&zipcode=${zip}`;

        //website URL 
        //let queryURL = `https://us-zipcode.api.smartystreets.com/lookup?key=${keyS}&candidates=1&match=invalid&street=${add1}&street2=${add2}&city=${city}&state=${state}&zipcode=${zip}`;
        //let queryURL = `https://us-zipcode.api.smartystreets.com/street-address?key=${keyS}&candidates=1&match=invalid&street=${add1}&street2=${add2}&city=${city}&state=${state}&zipcode=${zip}`;
        //let queryURL = `https://us-street.api.smartystreets.com/street-address?street=123+main+Schenectady+NY&key=3738001108134117`;
        let queryURL = `https://us-street.api.smartystreets.com/street-address?candidates=1&match=invalid&street=${encodeURIComponent(add1)}&street2=${encodeURIComponent(add2)}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&zipcode=${encodeURIComponent(zip)}&key=3738001108134117`;


        //console.log(keyS);
        console.log(queryURL);

        let promise = await Promise.all([
            $.ajax({
                url: queryURL,
                method: "GET"
            })
        ]);

        console.log(promise);

        this.du.parseAddress(promise);
        this.du.displayResolvedAddress();
        
        return 0;
    },

    async civicInfoResolve() {

        let selectCounty = JSON.parse(localStorage.getItem("cbs_cn"));
        let selectLocal = JSON.parse(localStorage.getItem("cbs_lcl"));
        let selectState = JSON.parse(localStorage.getItem("cbs_st"));
        let selectFederal = JSON.parse(localStorage.getItem("cbs_fd"));
        
        if(selectCounty) {
            let queryUrlCounty = `https://www.googleapis.com/civicinfo/v2/representatives?address=${this.du.addressReal}&includeOffices=true&key=${this.appKeyGoogle}&levels=administrativeArea2`;
            
            let promiseCounty = await Promise.all([
                $.ajax({
                    url: queryUrlCounty,
                    method: "GET"
                })
            ]);
            this.du.parseRepresentativeInfo(promiseCounty,"County");
        }


        if(selectLocal) {
            let queryUrlLocal = `https://www.googleapis.com/civicinfo/v2/representatives?address=${this.du.addressReal}&includeOffices=true&key=${this.appKeyGoogle}&levels=locality`;
            
            let promiseLocal = await Promise.all([
                $.ajax({
                    url: queryUrlLocal,
                    method: "GET"
                })
            ]);
            this.du.parseRepresentativeInfo(promiseLocal,"Local");
        }

        if(selectState) {
            let queryUrlState = `https://www.googleapis.com/civicinfo/v2/representatives?address=${this.du.addressReal}&includeOffices=true&key=${this.appKeyGoogle}&levels=administrativeArea1`;
            
            let promiseState = await Promise.all([
                $.ajax({
                    url: queryUrlState,
                    method: "GET"
                })
            ]);
            this.du.parseRepresentativeInfo(promiseState,"State");
        }

        if(selectFederal) {
            let queryUrlFederal = `https://www.googleapis.com/civicinfo/v2/representatives?address=${this.du.addressReal}&includeOffices=true&key=${this.appKeyGoogle}&levels=country`;
            
            let promiseFederal = await Promise.all([
                $.ajax({
                    url: queryUrlFederal,
                    method: "GET"
                })
            ]);
            this.du.parseRepresentativeInfo(promiseFederal,"Federal");
        }
    }
}

function apiKeySet() {
    /*TEMP*/
    localStorage.setItem("appIDSmartyStreets", JSON.stringify("64dbbfab-9906-6e7c-23ae-bf82bafd8720"));
    localStorage.setItem("authTokenSmartyStreets", JSON.stringify("6BKo0kIp3IwZD3o3wt7B"));
    localStorage.setItem("appKeyGoogle", JSON.stringify("AIzaSyDYsucFLhfwF4iEpT9CrAD7rCFdUvrQ87E"));
    /*TEMP*/
}

apiKeySet();
