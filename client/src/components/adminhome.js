import React, { useEffect, useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from 'react-paginate';
import { useRef } from "react";
export default function AdminHome({ userData }) {
    const [data, setData] = useState([])
    const [limit, setLimit] = useState(5)
    const [pageCout, setpageCount] = useState(1)
    const currentPage = useRef()



    useEffect(() => {
        currentPage.current = 1
        getpaginationUser()


    }, [])

    function getpaginationUser() {
        fetch(`http://localhost:5000/paginationUser?page=${currentPage.current}&limit=${limit}`,
            {
                method: "GET",

            })
            .then((res) => res.json()).then((data) => {
                console.log(data, "userData")
                setpageCount(data.pageCout)
                setData(data.result)

            })
    }

    const getAllUser = () => {
        fetch("http://localhost:5000/getuser",
            {
                method: "GET",

            })
            .then((res) => res.json()).then((data) => {
                console.log(data, "userData");
                setData(data.data)
            })
    }

    const logOut = () => {
        window.localStorage.clear()
        window.location.href = "./login"
    }
    const deleteUser = (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}`)) {
            fetch("http://localhost:5000/deleteuser", {
                method: "POST",
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    user_id: id,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    alert(data.data);
                    getAllUser();
                });
        } else {
        }
    }

    function handlePageClick(e) {
        console.log(e);
        currentPage.current = e.selected + 1
        getpaginationUser()

    }

    function changelimit() {
        currentPage.current = 1
        getpaginationUser()
    }




    return (
        <div className="auth-wrapper">
            <div className="auth-inner" style={{ width: "auto" }}>
                <h3>Admin</h3>
                <table style={{ width: 500 }}>
                    <tr className="text-center">
                        <th>Name</th>
                        <th>Email</th>
                        <th>Usertype</th>
                        <th>Delete</th>
                    </tr>
                    {data.map((i) => {
                        return (
                            <tr className="text-center">
                                <td>{i.fname} {i.lname} </td>
                                <td>{i.email} </td>
                                <td>{i.userType} </td>
                                <td><FontAwesomeIcon icon={faTrash} onClick={() => deleteUser(i._id, i.name)} /> </td>
                            </tr>


                        )
                    })}
                </table>
                <input placeholder="Limit" onChange={e => setLimit(e.target.value)} />
                <button onClick={changelimit}>Limit</button>
                <br></br>
                <br></br>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCout}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                    marginPagesDisplayed={2}
                    containerClassName="pagination justify-content-center"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    activeClassName="active"
                    forcePage={currentPage.current - 1}

                />

                <button onClick={logOut} className="btn btn-primary">
                    Log Out
                </button>
            </div>
        </div>
    );


}