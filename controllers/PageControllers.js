const vistaPrincipal = (req, res)=>{
    res.render('index')
}

const vistaEmpleado = (req, res)=>{
    res.render('empleados')
}

const vistaTarea = (req, res)=>{
    res.render('tareas')
}

const vistaSalario = (req, res)=>{
    res.render('salarios')
}
module.exports = {
    vistaPrincipal,
    vistaEmpleado,
    vistaTarea,
    vistaSalario
}