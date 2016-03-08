import {Injectable,OnInit} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Response, Headers} from 'angular2/http';

import {CategoryInterface} from './data.interface';
import {Statics} from './service.details';



@Injectable()
export class DataService implements OnInit{
    currentDate : Date = Math.floor(Date.now());
    //currentDate = '1457422118100';
    observable : Observable;
    moltin : any;

    constructor(private http:Http){}

    //authenticates with Moltin API and gets access token
    authorize(){
        this.moltin = new Moltin({publicId:Statics.PUBLIC_ID});
        this.moltin.Authenticate(
            function(response){
                sessionStorage.setItem('access-token' , JSON.stringify(response)                )}
        );
    }

    getData(dataurl:string){
        //stores sessionStorage in a temp varirable
        var session = JSON.parse(sessionStorage.getItem('access-token'));
        console.log(session.expires,this.currentDate);
        //

        //Checks if Token has expired
        if (this.currentDate >= session.expires){
            this.authorize();
           // console.log('new session');
        } else {
            //console.log('valid session');
        }

        //gets data from API
        return this.http.get(dataurl,{
                headers : new Headers({
                    "Authorization" : "Bearer " + session.token
                })
            })
            .map(data => data.json().result)
            .catch(this.handleError)
    }

    getCategories(){
        return this.getData('https://api.molt.in/v1/categories');
    }

    getAllProducts(){
        return this.getData('https://api.molt.in/v1/products');
    }

    getProductDetail(slug:string){
        //this.authorize();
        return this.getData('https://api.molt.in/v1/products/search?slug='+slug);
        //this.moltin.Product.Get(slug, function(product) {
        //    console.log(product);
        //}, function(error) {
        //    // Something went wrong...
        //})
    }

    search(terms:string){
        return this.getData('https://api.molt.in/v1/products/search?title='+ terms);
    }



    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

}
