import React from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { Colors } from 'chart.js';
import '../App.css';


class Graficos extends React.Component{

    state = {
        Municipios:[],
        Estado:"",
        Microrregioes:""
    }

    getDadosIBGE_Estados = (selectedRegion) => {
        const base = "https://servicodados.ibge.gov.br/api/v1/localidades/regioes/" + selectedRegion + "/estados"
        const api = axios.create({
            baseURL: base,
        });
        var temp = []
        var aux = [];
        api.get(base).then((response) =>  {   
           response.data.map( value => (
                temp.push(value.nome)
           ))
           this.setState({Estado: temp})
           //console.log(response.data)
           temp = []
           aux = []
           response.data.map( key => {
                //console.log(key);
                this.getDadosIBGE_Cidades(key.id, temp);
                this.getDadosIBGE_Microrregioes(key.sigla, aux);
                return ""
        })
        }).catch((err) => {
            console.error("Ops! Ocorreu um erro " + err);
        }); 
    }

    getDadosIBGE_Cidades = (Id, temp) =>{
        //console.log(Id)
        const base = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/" + Id + "/municipios"
        const api = axios.create({
            baseURL: base,
        });
        api.get(base).then((response) =>  {   
           //console.log(response.data)
           temp.push(response.data.length)
           this.setState({Municipios:temp})
        }).catch((err) => {
            console.error("Ops! Ocorreu um erro " + err);
        }); 
    }

    getDadosIBGE_Microrregioes = (UF, aux) =>{
        const base = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/" + UF + "/microrregioes"
        const api = axios.create({
            baseURL: base,
        });
        api.get(base).then((response) =>  {   
           //console.log(response.data)
           aux.push(response.data.length);
           this.setState({Microrregioes:aux});
        }).catch((err) => {
            console.error("Ops! Ocorreu um erro " + err);
        }); 
    }

    handleRegion = ( selectedRegion)  => {
        this.setState({Municipios:[], Estado:""})
        this.setState({ selectedRegion } );
        this.getDadosIBGE_Estados(selectedRegion);
    }

    GraficoDeBarras = () => {
        const data = {
            labels: this.state.Estado,
            datasets: [
                {
                  label: 'Municípios',
                  data: this.state.Municipios,
                  borderWidth: 1,
                }
            ]
        }

        return (
            <div className="chart-container">
            <h2 style={{ textAlign: "center" }}>Gráfico de barras</h2>
                <Bar
                  data={data}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: "Quantidade de cidades por estado"
                      },
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
        </div> )
    }

    GraficoDePizza = () =>{
        Chart.register(Colors);
        const chartData = {
            labels: this.state.Estado,
            datasets: [
                {
                  label: 'Microrregioes',
                  data: this.state.Microrregioes,
                  borderWidth: 1,
                }
            ]
        }

        return (
            <div className="chart-container">
              <h2 style={{ textAlign: "center" }}>Gráfico de Pizza</h2>
              <Pie
                data={chartData}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Quantidade de microrregiões por estado"
                    },
                    colors: {
                        enabled: true,
                        forceOverride: true
                      }
                  }
                }}
              />
            </div>
          );
    }

    myFunction = () =>{
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("myTable");
        tr = table.getElementsByTagName("tr");
        var id = "none";
        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[1];
            
            if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
                id = tr[i].getElementsByTagName("td")[0];
                //console.log(txtValue)
            } else {
                tr[i].style.display = "none";
            }
            }
        }
        
        if ( filter === "" ){
            //console.log("teste")
            this.setState({ Municipios:[],
                Estado:"",
                Microrregioes:""})
            this.getDadosIBGE_Estados("none");
        }
        else{
            this.getDadosIBGE_Estados(id.textContent);
        }
       
    }

    Tabela = () =>{
        const table = (
            <div>
                <input type="text" id="myInput" onChange={() => this.myFunction()} placeholder="Digite uma regiao..." title="Type in a name"/>
            <table id="myTable">
                <tr class="header">
                    <th style={{width:"30%"}}>Id</th>
                    <th style={{width:"30%"}}>Regiões</th>
                    <th style={{width:"40%"}}>Quantidade de estados</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Norte</td>
                    <td>07 estados</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Nordeste</td>
                    <td>09 estados</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>Sudeste</td>
                    <td>04 estados</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>Sul</td>
                    <td>03 estados</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>Centro Oeste</td>
                    <td> 03 estados + DF</td>
                </tr>
                </table> 
                </div>)
        return table;
    }

    render(){
        return(
            <div> 
                <div class="col-md-12"></div>
                    <div class="op1">{this.GraficoDeBarras()}</div>
                    <div class="op2">{this.GraficoDePizza()}</div>
                    <div class="op3"><h2 class={"title"}>Regiões</h2>{this.Tabela()}</div>
            </div>
        )
    }
}


export default Graficos;