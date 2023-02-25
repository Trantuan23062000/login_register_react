import React, { Component } from 'react'

export default class Login extends Component {
    constructor(pops) {
        super(pops);
        this.state = {
            email: "",
        }
        this.haddleSumit = this.haddleSumit.bind(this);
    }
    haddleSumit(e) {
        e.preventDefault();
        const { email } = this.state;
        console.log(email);
        fetch("http://localhost:5000/forgot-password", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                email
            }),

        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "user forgot password !");
                alert(data.status)


            });
    }
    render() {
        return (
            <form onSubmit={this.haddleSumit}>
                <h3>Forgot Password</h3>

                <div className="mb-3">
                    <label>Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        onChange={(e) => this.setState({ email: e.target.value })}
                    />
                </div>

                <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </div>
                <p className="forgot-password text-right">
                    Forgot <a href="/forgot-password">password?</a>
                </p>
            </form>
        )
    }
}
