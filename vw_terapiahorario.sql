alter VIEW vw_terapiahorario
AS
	SELECT
		a.IdTerapia
		,a.Numero
		,a.DiaSemana
		,case when DiaSemana = 0 then 'Domingo'
			when DiaSemana = 1 then 'Lunes'
			when DiaSemana = 2 then 'Martes'
			when DiaSemana = 3 then 'Miercoles'
			when DiaSemana = 4 then 'Jueves'
			when DiaSemana = 5 then 'Viernes'
			when DiaSemana = 6 then 'Sabado'
			ELSE '' END AS Dia
		,TIME_FORMAT(a.HoraInicio, "%H:%i") AS HoraInicio
		#,a.HoraInicio
		,TIME_FORMAT(DATE_ADD(a.HoraInicio, INTERVAL (case when b.MinutosSesion IS NULL then 0 ELSE b.MinutosSesion END) MINUTE), "%H:%i") AS HoraFin
		,a.FechaRegistro
		,a.UsuarioRegistro
		,a.FechaModificacion
		,a.UsuarioModificacion
	from terapiahorario a 
	left join terapia b ON
		a.IdTerapia = b.IdTerapia
	