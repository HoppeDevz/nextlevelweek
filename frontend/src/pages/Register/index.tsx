import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { FiArrowDownLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';

import axios, { AxiosResponse } from 'axios';

interface Item {
    id: number,
    title?: string,
    imageUrl?: string
}

interface uf {
    id: number,
    sigla?: string,
    nome?: string,
    regiao?: object
}

interface city {
    id: number,
    nome: string,
    microrregiao: object
}


export default function Register(): JSX.Element {
    const[items, setItems] = useState<Item[]>([]);
    const[uflist, setUflist] = useState<uf[]>([]);
    const[citylist, setCityList] = useState<city[]>([]);
    const[coords, setCoords] = useState<[number, number]>([0, 0])
    const[userCoords, setUserCoords] = useState<[number, number]>([0, 0]);
    const[uf, setUf] = useState("0");
    const[city, setCity] = useState("0");
    const[itemList, setItemList] = useState<number[]>([])

    const[name, setName] = useState<string>("");
    const[email, setEmail] = useState<string>("");
    const[whatsapp, setWhatsapp] = useState<string>("");
    
    useEffect(() => {
        api.get('items').then((response : AxiosResponse) => {
            setItems(response.data)
        })
    },[])


    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then((response : AxiosResponse) => {
            setUflist(response.data)
        })
    })

    useEffect(() => {
        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`).then((response : AxiosResponse ) => {
            setCityList(response.data)
        })
    },[uf])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            // console.log(position.coords)
            setUserCoords([
                position.coords.latitude,
                position.coords.longitude
            ])
        })
    },[])

    function handleSelectUf(e : ChangeEvent<HTMLSelectElement>) {
        setUf(e.target.value)
    }

    function handleSelectCity(e : ChangeEvent<HTMLSelectElement>) {
        setCity(e.target.value)
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setCoords([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleSelectItem(id : number) {
        const alreadyExistItems = itemList.findIndex(item => item == id)

        if (alreadyExistItems >= 0) {
            const filtredItems = itemList.filter(item => item !== id)
            setItemList(filtredItems)
        } else {
            setItemList([...itemList, id ])
        }
        
    }

    function submitHandler(e : FormEvent) {
        e.preventDefault();

        const latitude : number = coords[0];
        const longitude: number = coords[1];

        const items: number[] = itemList;

        api.post("spots/create", { 
            image: "null",
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
         }).then(response => {
             console.log(response.data)
         }).catch(err => {
             console.log(err)
         })
    }

    return(
        <div>
            <div id="page-create-point">
                <header>
                    <img src={logo} alt="Ecoleta" />
                    <Link to="/">
                        <FiArrowDownLeft /> Voltar para home
                    </Link>
                </header>

                <form onSubmit={submitHandler}>
                    <h1>Cadastro do <br></br> ponto de coleta</h1>

                    <fieldset>
                        <legend>
                            <h2>Dados</h2>
                        </legend>

                        <div className="field">
                            <label htmlFor="name">Nome da entidade</label>
                            <input  
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            />
                        </div> 

                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="email">E-mail</label>
                                <input  
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                />
                            </div> 
                            <div className="field">
                                <label htmlFor="whatsapp">Whatsapp</label>
                                <input  
                                placeholder="() xxxx-xxxx"
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                value={whatsapp}
                                onChange={e => setWhatsapp(e.target.value)}
                                />
                            </div> 
                        </div>

                    </fieldset>

                    <fieldset>
                        <legend>
                            <h2>Endereço</h2>
                            <span>Selecione o endereço no mapa</span>
                        </legend>

                        <Map center={userCoords} zoom={15} onclick={handleMapClick} >
                        <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={coords} />
                        </Map>

                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="uf">Estado(UF)</label>
                                <select name="uf" id="uf" onChange={handleSelectUf} >
                                    <option value="0">Selecione uma UF</option>
                                    {uflist.map(uf => (
                                        <option key={uf.id} >{uf.sigla}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label htmlFor="city">Cidade</label>
                                <select name="city" id="city" onChange={handleSelectCity} >
                                    {citylist.map(city => (
                                        <option key={city.nome} value={city.nome}>{city.nome}</option>
                                    ))}
                                    <option value="0">Selecione uma Cidade</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>
                            <h2>Items de Coleta</h2>
                            <span>Selecione um ou mais ítens abaixo</span>
                        </legend>    

                            <ul className="items-grid">
                                {items.map(item => (
                                    <li 
                                    key={item.id} 
                                    className={itemList.includes(item.id) ? 'selected' : ''} 
                                    onClick={() => handleSelectItem(item.id) } >
                                        <img src={item.imageUrl} alt={item.title} />
                                        <span>{item.title}</span>
                                    </li>  
                                )
                                )}
                            </ul>

                    </fieldset>
                    <button type="submit">
                        Cadastrar ponto de coleta
                    </button>
                </form>
            </div>
        </div>
    );
}