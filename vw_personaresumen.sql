ALTER VIEW vw_personaresumen
as
	with ltbl_documento AS (
		select
			a.IdPersona AS IdPersona
			,row_number() OVER (PARTITION BY a.IdPersona ORDER BY a.IdPersona,b.Orden )  AS Orden
			,a.IdTipoDocumento AS IdTipoDocumento
			,b.Descripcion AS Descripcion
			,a.NumeroDocumento AS NumeroDocumento
		from personadocumento a
		join catalogo b on
			a.IdTipoDocumento = b.IdCatalogo
	)
	, ltbl_direccion AS (
		select
			a.IdPersona AS IdPersona
			,row_number() OVER (PARTITION BY a.IdPersona ORDER BY a.IdPersona,b.Orden )  AS Orden
			,b.Descripcion AS Descripcion
			,c.Detalle AS Detalle
		from personadireccion a
		join catalogo b on
			a.IdTipoDireccion = b.IdCatalogo
		join direccion c on
			a.IdDireccion = c.IdDireccion
	)
	, ltbl_contactocelular as (
		select
			a.IdPersona AS IdPersona
			,row_number() OVER (PARTITION BY a.IdPersona ORDER BY a.IdPersona,b.Orden )  AS Orden
			,b.Descripcion AS Descripcion
			,a.Valor AS Valor
		from personacontacto a
		join catalogo b on
			a.IdTipoContacto = b.IdCatalogo
			and (
				b.IdCatalogo = 69
				or b.IdPadre = 69
			)
	)
	, ltbl_contactocorreo as (
		select
			a.IdPersona AS IdPersona
			,row_number() OVER (PARTITION BY a.IdPersona ORDER BY a.IdPersona,b.Orden )  AS Orden
			,b.Descripcion AS Descripcion
			,a.Valor AS Valor
		from personacontacto a
		join catalogo b on
			a.IdTipoContacto = b.IdCatalogo
			and (
				b.IdCatalogo = 17
				or b.IdPadre = 17
			)
	)
	select
		a.IdPersona AS IdPersona
		,a.Nombres AS Nombres
		,if(c.IdTipoDocumento IS NULL, 0, c.IdTipoDocumento) AS IdTipoDocumento
		,if(c.Descripcion IS NULL, '', c.Descripcion) AS TipoDocumento
		,if((c.NumeroDocumento is null),'',c.NumeroDocumento) AS NumeroDocumento
		,if(b.IdTipoPersona IS NULL, 0, b.IdTipoPersona) AS IdTipoPersona
		,if(g.Descripcion IS NULL, '', g.Descripcion) AS TipoPersona
		,b.FechaNacimiento AS FechaNacimiento
		,if(e.Valor IS NULL, '', e.Valor) AS Celular
		,if(f.Valor IS NULL, '', f.Valor) AS Email
		,if(d.Detalle IS NULL, '', d.Detalle) AS Direccion
		,if(h.IdTipo IS NULL, 0, h.IdTipo) AS IdTipoEmpresa
		,if(i.Descripcion IS NULL, '', i.Descripcion) AS TipoEmpresa
		,a.EsEmpresa
		,if(a.EsEmpresa IS true, 'S', 'N') AS Empresa
	from persona a
	left join personanatural b on
		a.IdPersona = b.IdPersona
	left join ltbl_documento c on
		a.IdPersona = c.IdPersona
		and c.Orden = 1
	left join ltbl_direccion d on
		a.IdPersona = d.IdPersona
		and d.Orden = 1
	left join ltbl_contactocelular e on
		a.IdPersona = e.IdPersona
		and e.Orden = 1
	left join ltbl_contactocorreo f on
		a.IdPersona = f.IdPersona
		and f.Orden = 1
	left join catalogo g on
		b.IdTipoPersona = g.IdCatalogo
	left join personajuridica h on
		a.IdPersona = h.IdPersona
	left join catalogo i on
		h.IdTipo = i.IdCatalogo
