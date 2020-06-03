import React from 'react';
import logo from '../../assets/logo.svg';
import './styles.css';
import { FiLogIn } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { FormEvent } from 'react'

export default function Home() : JSX.Element {
    const history = useHistory();

    function submitHandler(e : FormEvent) {
        e.preventDefault()
        history.push("/cadastro")
    }

    return(
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta" /> 
                </header>

                <main>
                    <h1>Seu marketplace de coleta de resíduos.</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>

                    <a href='/cadastro'>
                        <span>
                            <FiLogIn />
                        </span>
                        <strong onClick={(e) => submitHandler(e)} >Cadastre um ponto de coleta</strong>
                    </a>

                </main>
            </div>
        </div>
    )
}