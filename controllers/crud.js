const conexion = require('../database/db');

//Registro de Empleados
exports.save = (req, res) =>{
    const nombre = req.body.nombre;
    const fechaContratacion = req.body.fechaContratacion;
    const sueldo = req.body.sueldo;
    const horasTrabajadas = req.body.horasTrabajadas;
    const departamento = req.body.departamento;
    
    // Validar que los campos no estén vacíos
    if (!nombre || !fechaContratacion || !sueldo || !horasTrabajadas || !departamento) {
        return res.status(400).send("Todos los campos son obligatorios");
    }

    // Validar que las horasTrabajadas y el sueldo sean números positivos
    if (isNaN(sueldo) || isNaN(horasTrabajadas) || sueldo < 0 || horasTrabajadas < 0) {
        return res.status(400).send("Sueldo y horas trabajadas deben ser números positivos");
    }
    
    // Insertar en la base de datos
    conexion.query('INSERT INTO empleados SET ?', {nombre:nombre, fechaContratacion:fechaContratacion, sueldo:sueldo,
        horasTrabajadas:horasTrabajadas, departamento:departamento}, (error, resultados) =>{
            if(error){
                throw error;
            }else{
                res.redirect('empleados');
            }
    })
}

//Registro de Tareas
exports.tarea = (req, res) => {
    const { empleado_id, tiempo } = req.body;
    const consultaEmpleado = 'SELECT horasTrabajadas FROM empleados WHERE id = ?';

    conexion.query(consultaEmpleado, [empleado_id], (err, resultadosEmpleado) => {
        if (err) {
            console.log(err);
            return res.redirect('/index');
        }

    const horasTrabajadas = resultadosEmpleado[0].horasTrabajadas;
        if (horasTrabajadas < tiempo) { 
            const flash=  'Las horas de tareas no pueden ser mayor a las horas trabajadas.';
            return res.render('tareafn',{flash});
        } else {
            const nuevaTarea = {
                tipo: req.body.tipo,
                tiempo: req.body.tiempo,
                empleado_id: req.body.empleado_id
            };
            conexion.query('INSERT INTO tareas SET ?', nuevaTarea, (err) => {
                if (err) {
                    console.log(err);
                    return res.redirect('/index');
                }
                    return res.redirect('/empleados');
            });
        }
    });
};

//Consulta para ver el total de los salarios Pagados
exports.verSalarios = (req, res) => {
    const consultaTotalSalariosPorFecha = `SELECT fechaContratacion, SUM(sueldo) as totalSalarios
      FROM empleados WHERE salario = 1
      GROUP BY fechaContratacion
      ORDER BY fechaContratacion`
      ;
  
    conexion.query(consultaTotalSalariosPorFecha, (err, empleadosPorFecha) => {
      if (err) {
        console.error('Error al consultar salarios por fecha: ' + err.stack);
        return res.status(500).send('Error en el servidor');
      }

      const consultaTotalSalariosGeneral = `
        SELECT SUM(sueldo) as totalSalariosGeneral
        FROM empleados
        WHERE salario = 1
      `;
  
      conexion.query(consultaTotalSalariosGeneral, (err, resultadoTotalSalarios) => {
        if (err) {
          console.error('Error al consultar total general de salarios: ' + err.stack);
          return res.status(500).send('Error en el servidor');
        }
  
        const totalSalariosGeneral = resultadoTotalSalarios[0].totalSalariosGeneral;
  
        // Renderizar la vista con los datos
        res.render('salarios', { empleadosPorFecha, totalSalariosGeneral });
      });
    });
  };