alter VIEW vw_terapiaperiodoresumen
AS
	SELECT
		a.IdTerapiaPeriodo
		,a.IdTerapia
		,a.Numero
		,a.IdPeriodo
		,b.IdTipo
		,b.Tipo
		,b.FechaInicio
		,b.Codigo CodigoPeriodo
		,b.IdEstado
		,e.Descripcion EstadoPeriodo
		,d.Participante
		,d.Terapeutas
		,c.Abreviado AS AbreviaturaEstado
		,c.Descripcion AS Estado
		
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
	left join vw_periodo b ON
		a.IdPeriodo = b.IdPeriodo
	left join catalogo c ON
		a.IdEstado = c.IdCatalogo
	left join vw_terapiaresumen d ON
		a.IdTerapia = d.IdTerapia
		AND a.Numero = d.Numero
	left join catalogo e ON
		b.IdEstado = e.IdCatalogo
	
		
	