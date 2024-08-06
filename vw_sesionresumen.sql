ALTER VIEW vw_sesionresumen
AS
	SELECT
		a.IdSesion
		,a.IdTerapiaPeriodo
		,b.IdTerapia
		,b.Numero
		,b.IdPeriodo
		,b.CodigoPeriodo
		,b.EstadoApertura
		,b.Participante
		,b.IdTerapeuta
		,b.Terapeuta
		,a.Fecha
		,a.HoraInicio
		,a.EstadoAsistencia
		,a.Modalidad
		,a.PuntuacionCriterio
		,a.PuntuacionActividad
		,a.IdEstado
		,a.Estado
	from vw_sesion a
	inner join vw_terapiaperiodoresumen b ON
		a.IdTerapiaPeriodo = b.IdTerapiaPeriodo
		AND b.IdEstado = 2
