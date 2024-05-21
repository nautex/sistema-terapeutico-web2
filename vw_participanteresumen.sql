alter VIEW vw_participanteresumen
AS
	with ltbl_personaautorizada AS 
	(
		select
			a.IdParticipante
			,GROUP_CONCAT(b.Nombres SEPARATOR ' - ') AS PersonasAutorizadas
		from participantepersonaautorizada a 
		left join persona b ON
			a.IdPersona = b.IdPersona
		GROUP by
			a.IdParticipante
	)
	SELECT
		a.IdParticipante
		,c.Nombres AS Participante
		,a.FechaIngreso AS FechaIngreso
		,e.IdPersona AS IdPadre
		,if((e.Nombres IS NULL),'',e.Nombres) AS Padre
		,g.IdPersona AS IdMadre
		,if((g.Nombres IS NULL),'',g.Nombres) AS Madre
		,a.LugarCasoAccidente AS LugarCasoAccidente 
		,if((h.PersonasAutorizadas IS NULL),'',h.PersonasAutorizadas) AS PersonasAutorizadas
	from participante a 
	left join persona c ON
		a.IdPersona = c.IdPersona
	left join personavinculacion d ON
		c.IdPersona = d.IdPersona
		and d.IdTipoVinculo = 43
	left join persona e ON
		d.IdPersonaVinculo = e.IdPersona
	left join personavinculacion f ON
		c.IdPersona = f.IdPersona
		and f.IdTipoVinculo = 44
	left join persona g ON
		f.IdPersonaVinculo = g.IdPersona
	left join ltbl_personaautorizada h ON
		a.IdParticipante = h.IdParticipante
	