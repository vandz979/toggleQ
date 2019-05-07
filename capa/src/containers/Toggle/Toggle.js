import React, {Component} from "react";
import axios from "axios";

import classes from "./Toggle.module.css"



class Toggle extends Component {

    state = {
        queueState: false,
        finalData: []
    }
    
    c = 0;
    SENDREQ = [];
    SENDREQFALSE = [];


    postHandler = () => {
        this.c += 1;
        const somedata = {
            title: 'foo',
            body: 'bar',
            userId: this.c
        }
        axios.post("https://jsonplaceholder.typicode.com/posts",somedata)
            .then((response) => {
                console.log(somedata);
            })
    }

    toggleQueue = () => {
        this.setState((prevState) => {return({queueState: !prevState.queueState})});  


     }

     addHandler = () => {
         this.c += 1;
         this.addQueue(this.c);
         console.log(this.SENDREQ, this.SENDREQFALSE);

     }

     addQueue = (val) => {
            

            if(this.state.queueState){
                this.SENDREQ.push(val);     

                if(this.SENDREQ.length === 10 || this.SENDREQ.length > 10){
                    this.callaxios();
                }
            }
        else {
            
            this.SENDREQFALSE.push(val);
            axios.get(`https://jsonplaceholder.typicode.com/todos/${val}`).then((response) => {
                const d = response.data.title;
                const newarr = [...this.state.finalData]
                newarr.push(d);
                this.setState({finalData: newarr})

            })
        }
    }

    callaxios = (val) => {

        axios.all(this.SENDREQ.map((cur) => axios.get(`https://jsonplaceholder.typicode.com/todos/${cur}`)))
                .then((response) => {
                    let data  = response.map((cur1) => cur1.data);
                    let final = this.SENDREQ.map((cur) => {
                        for(let i=0; i<data.length; i++){
                            if(cur === data[i].id){
                                return data[i].title;
                            } 
                        }

                    })

                    this.setState({finalData: final.concat(this.state.finalData)});
                    this.SENDREQ =[];

                })

                
    }

     
    render(){

        let listArr = [];
        if(this.state.finalData.length > 0){
            listArr= this.state.finalData.map((cur) => {
                return <li key={cur}>{cur}</li>
        })
        }


        return(
            <div className={classes.top}>
                <div className={classes.listArray}>
                <input type="checkbox" name="toggle" id="toggle" onChange={this.toggleQueue}/>True Or False
                <hr />
                <button onClick={this.addHandler}>Add Item</button>
                    <div >
                        <ul>
                            {listArr}
                        </ul>
                    </div>
                </div>
                
                <div className={classes.btn}>
                    <button onClick={this.postHandler}>Send Request</button>
                </div>
            </div>
        );

    }
}


export default Toggle;