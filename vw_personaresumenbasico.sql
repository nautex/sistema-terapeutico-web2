ALTER VIEW vw_personaresumenbasico
as
	SELECT
		row_number() OVER (ORDER BY a.IdPersona,b.Numero )  AS Id
		,a.IdPersona AS IdPersona
		,a.Nombres AS Nombres
		,b.IdTipoDocumento AS IdTipoDocumento
		,c.Descripcion AS TipoDocumento
		,if((b.NumeroDocumento is null),'',b.NumeroDocumento) AS NumeroDocumento
		,if(a.EsEmpresa IS true, 'S', 'N') AS EsEmpresa
	from persona a
	left join personadocumento b ON
		a.IdPersona = b.IdPersona
	left join catalogo c ON
		b.IdTipoDocumento = c.IdCatalogo
