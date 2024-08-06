alter VIEW vw_terapiaresumen
AS
	with ltbl_terapiaterapeuta AS 
	(
		/*SELECT
			a.IdTerapia
			,GROUP_CONCAT(if(c.Seudonimo IS NULL, b.Nombres, c.Seudonimo) SEPARATOR ' - ') AS Terapeutas
		FROM terapiaterapeuta a 
		left join persona b ON
			a.IdTerapeuta = b.IdPersona
		left join trabajador c ON
			a.IdTerapeuta = c.IdPersona
		where
			a.IdTipoCargo = 54
			and a.IdEstado = 2
		GROUP BY
			a.IdTerapia*/
		SELECT
			a.IdTerapia
			,ROW_NUMBER() OVER (PARTITION BY a.IdTerapia ORDER BY a.IdTerapia, a.Numero)  AS Orden
			,a.IdTerapeuta
			,if(c.Seudonimo IS NULL, b.Nombres, c.Seudonimo) AS Terapeuta
		FROM terapiaterapeuta a 
		left join persona b ON
			a.IdTerapeuta = b.IdPersona
		left join trabajador c ON
			a.IdTerapeuta = c.IdTrabajador
		where
			a.IdTipoCargo = 54
			and a.IdEstado = 2
	)
	, ltbl_terapiahorario AS 
	(
		SELECT
			IdTerapia
			,GROUP_CONCAT(concat(
				case when DiaSemana = 0 then 'DO'
				when DiaSemana = 1 then 'LU'
				when DiaSemana = 2 then 'MA'
				when DiaSemana = 3 then 'MI'
				when DiaSemana = 4 then 'JU'
				when DiaSemana = 5 then 'VI'
				when DiaSemana = 6 then 'SA'
				ELSE '' END, ' ', TIME_FORMAT(HoraInicio, "%H:%i")) SEPARATOR ' - ') AS Horario
		FROM terapiahorario
		GROUP BY
			IdTerapia
	)
	SELECT
		row_number() OVER (ORDER BY a.IdTerapia,i.Numero )  AS Id
		,a.IdTerapia
		,i.Numero
		,a.IdLocal
		,b.Codigo AS Local
		,j.Codigo AS CodigoServicio
		,c.Codigo AS CodigoTarifa
		,i.IdParticipante
		,if(l.Nombres IS NULL, '-', l.Nombres) AS Participante
		,g.IdTerapeuta
		,if(g.Terapeuta IS NULL, '-', g.Terapeuta) AS Terapeuta
		,if(h.Horario IS NULL, '-', h.Horario) AS Horario
		,e.Codigo AS Salon
		#,c.Monto AS MontoTarifa
		,a.FechaInicio
		,a.IdTipo
		,d.Descripcion AS Tipo
		#,a.SesionesMes
		,a.IdEstado
		,f.Abreviado AS Estado
	from terapia a 
	left join local b ON
		a.IdLocal = b.IdLocal
	left join tarifa c ON
		a.IdTarifa = c.IdTarifa
	left join catalogo d ON
		a.IdTipo = d.IdCatalogo
	left join salon e ON
		a.IdSalon = e.IdSalon
	left join catalogo f ON
		a.IdEstado = f.IdCatalogo
	LEFT JOIN ltbl_terapiaterapeuta g on
		a.IdTerapia = g.IdTerapia
		AND g.Orden = 1
	LEFT JOIN ltbl_terapiahorario h on
		a.IdTerapia = h.IdTerapia
	LEFT JOIN terapiaparticipante i on
		a.IdTerapia = i.IdTerapia
	LEFT JOIN servicio j on
		c.IdServicio = j.IdServicio
	left join participante k ON
		i.IdParticipante = k.IdParticipante
	left join persona l ON
		k.IdPersona = l.IdPersona	
	
		
	