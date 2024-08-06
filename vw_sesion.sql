alter VIEW vw_sesion
AS
	SELECT
		a.IdSesion
		,a.IdTerapiaPeriodo
		,g.IdTerapia
		,g.CodigoPeriodo
		,g.Participante
		,a.Fecha
		,TIME_FORMAT(a.HoraInicio, "%H:%i") AS HoraInicio
		,a.IdEstadoAsistencia
		,b.Descripcion AS EstadoAsistencia
		,a.IdModalidad
		,c.Descripcion AS Modalidad
		,a.IdPuntuacionCriterio
		,d.Nombre AS PuntuacionCriterio
		,a.IdPuntuacionActividad
		,e.Nombre AS PuntuacionActividad
		,a.IdEstado
		,f.Codigo AS Estado
		,a.Observaciones
		,a.FechaRegistro
		,a.UsuarioRegistro
		,a.FechaModificacion
		,a.UsuarioModificacion
	from sesion a
	left join catalogo b ON
		a.IdEstadoAsistencia = b.IdCatalogo
	left join catalogo c ON
		a.IdModalidad = c.IdCatalogo
	left join puntuacion d ON
		a.IdPuntuacionCriterio = d.IdPuntuacion
	left join puntuacion e ON
		a.IdPuntuacionActividad = e.IdPuntuacion
	left join catalogo f ON
		a.IdEstado = f.IdCatalogo
	LEFT JOIN vw_terapiaperiodoresumen g on
		a.IdTerapiaPeriodo = g.IdTerapiaPeriodo
	
