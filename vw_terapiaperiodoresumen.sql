alter VIEW vw_terapiaperiodoresumen
AS
	SELECT
		a.IdTerapiaPeriodo
		,a.IdTerapia
		,a.Numero
		,a.IdPeriodo
		,b.IdTipoTerapia
		,b.TipoTerapia
		,b.FechaInicio
		,b.Codigo CodigoPeriodo
		,b.IdEstadoApertura
		,b.EstadoApertura
		,d.Participante
		,d.IdTerapeuta
		,d.Terapeuta
		,a.IdTarifa
		,a.IdEstado
		,c.Abreviado AS Estado
		
		#,a.IdLocal
		#,b.Codigo AS Local
		#,j.Codigo AS CodigoServicio
		#,c.Codigo AS CodigoTarifa
		#,i.IdParticipante
		#,if(g.Terapeutas IS NULL, '-', g.Terapeutas) AS Terapeutas
		#,if(h.Horario IS NULL, '-', h.Horario) AS Horario
		#,e.Codigo AS Salon
		#,c.Monto AS MontoTarifa
		#,a.FechaInicio
		#,d.Descripcion AS Modalidad
		#,a.SesionesMes

	from terapiaperiodo a 
	inner join vw_periodo b ON
		a.IdPeriodo = b.IdPeriodo
		AND b.IdEstado = 2
	left join catalogo c ON
		a.IdEstado = c.IdCatalogo
	inner join vw_terapiaresumen d ON
		a.IdTerapia = d.IdTerapia
		AND a.Numero = d.Numero
		AND d.IdEstado = 2
