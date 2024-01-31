const express = require('express');
const router = express.Router();
const conexion = require('../database/db');


router.get('/',(req,res)=>{
    res.render('index')
})
router.post('/empleados', (req, res) => {
    res.redirect('/empleados');
});

const crud = require('../controllers/crud')
router.post('/save', crud.save)
/* router.get('/salarios', crud.calcularTotalSueldos) */

//Ruta de busqueda
router.get('/empleados', (req, res) => {
    const buscar = req.query.buscar;
    if (buscar) {
        conexion.query(`SELECT * FROM empleados WHERE departamento LIKE '%${buscar}%'`, (error, resultados) => {
            if (error) {
                throw error;
            } else {
                res.render('empleados', { resultados: resultados, buscar: buscar });
            }
        });
    } else {
        conexion.query('SELECT * FROM empleados', (error, resultados) => {
            if (error) {
                throw error;
            } else {
                res.render('empleados', { resultados: resultados },);
            }
        });
    }
});

//Rutas para las tareas
router.get('/tareas',(req,res)=>{
    conexion.query('SELECT * FROM empleados',(error,resultados)=>{
        if(error){
            throw error;
        }else{
            res.render('tareas',{resultados:resultados})
        }
    })

})
router.post('/tareasf', crud.tarea)
router.get('/tareasmessage',(req,res)=>{
    res.render('tareasfn')
})

//ruta consultar Salario Total
router.get('/salarios', crud.verSalarios)

module.exports = {routes: router}