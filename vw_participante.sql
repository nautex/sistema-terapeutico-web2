alter VIEW vw_participante
AS
	SELECT
		a.IdParticipante
		,a.IdPersona
		,b.Nombres AS Participante
		,a.FechaIngreso
		,if((e.Nombres IS NULL),'',e.Nombres) AS Padre
		,if((g.Nombres IS NULL),'',g.Nombres) AS Madre
		,a.IdNivelLenguaje
		,i.Descripcion AS NivelLenguaje
		,a.IdColegio
		,j.Nombres AS Colegio
		,a.GradoColegio
		,a.IdTipoSeguro
		,k.Descripcion AS TipoSeguro
		,a.DetalleSeguro
		,a.LugarCasoAccidente
		,a.IdDireccionCasoAccidente
		,h.Ubigeo AS UbigeoCasoAccidente
		,h.Detalle AS DireccionCasoAccidente
		,a.DetalleHermanos
		,a.TieneDiagnostico
		,a.FechaUltimoDiagnostico
		,a.AsisteATerapia
		,a.IdTipoTerapia
		,l.Descripcion AS TipoTerapia
		,a.FechaRegistro
		,a.UsuarioRegistro
		,a.FechaModificacion
		,a.UsuarioModificacion
	from participante a 
	left join persona b ON
		a.IdPersona = b.IdPersona
	left join personavinculacion d ON
		b.IdPersona = d.IdPersona
		and d.IdTipoVinculo = 43
	left join persona e ON
		d.IdPersonaVinculo = e.IdPersona
	left join personavinculacion f ON
		b.IdPersona = f.IdPersona
		and f.IdTipoVinculo = 44
	left join persona g ON
		f.IdPersonaVinculo = g.IdPersona
	LEFT JOIN vw_direccion h on
		a.IdDireccionCasoAccidente = h.IdDireccion
	LEFT JOIN catalogo i on
		a.IdNivelLenguaje = i.IdCatalogo
	LEFT JOIN persona j on
		a.IdColegio = j.IdPersona
	LEFT JOIN catalogo k on
		a.IdTipoSeguro = k.IdCatalogo
	LEFT JOIN catalogo l on
		a.IdTipoTerapia = l.IdCatalogo
	