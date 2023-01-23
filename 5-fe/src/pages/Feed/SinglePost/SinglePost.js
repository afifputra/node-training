import React, { Component } from "react";

import Image from "../../../components/Image/Image";
import "./SinglePost.css";

class SinglePost extends Component {
  state = {
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;

    const graphqlQuery = {
      query: `{
        getPost(id: "${postId}") {
          title
          content
          imageUrl
          creator {
            name
          }
          createdAt
        }
      }`,
    };

    fetch(`http://localhost:3003/graphql`, {
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then(({ data: resData }) => {
        if (resData.errors) {
          throw new Error("Fetching post failed!");
        }
        this.setState({
          title: resData.getPost.title,
          author: resData.getPost.creator.name,
          date: new Date(resData.getPost.createdAt).toLocaleDateString("en-US"),
          content: resData.getPost.content,
          image: `http://localhost:3003/${resData.getPost.imageUrl}`,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
