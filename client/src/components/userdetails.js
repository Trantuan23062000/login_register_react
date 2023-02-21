import React, { Component } from "react";


export default class Userdetails extends Component {
    constructor(data) {
        super(data);
        this.state = {
            userData: "",
        }
    }
    componentDidMount() {
        fetch("http://localhost:3000/user", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
            }),

        })
            .then((res) => res.json())
            .then((data) => {
                this.setState({ userData: data.data })
                if (data.data === 'token expired') {
                    alert("Ban da het thoi gian cho vui long dang nhap lai");
                    window.localStorage.clear();
                    window.location.href = "./login";
                }
            });

    }
    Logout = () => {
        window.localStorage.clear();
        window.location.href = "./login"
    }
    render() {
        return (
            <div>
                <h6>hello {this.state.userData.lname}</h6>
                <h6>Email login: {this.state.userData.email}</h6>
                <button onClick={this.Logout} type="submit" className="btn btn-primary">Logout</button>
            </div>
        )
    }

}

