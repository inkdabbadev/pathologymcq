-- Seed the admin-editable home slide viewer config into site_settings (merge; other settings preserved).
-- Run in the Supabase SQL editor.
update public.catalog_items
set data = data || '{"homeSlide":{"heading":"Explore a real histology slide","subtitle":"The same zoomable microscopy viewer used throughout our question bank — pan, zoom, and jump to labeled findings.","title":"Lichen Planus — Thin Skin","caption":"Pinch, scroll or drag to explore the slide - or jump straight to a labeled finding.","tileSource":"/dzi/Lichen planus.dzi","regions":[{"key":"thin","label":"Wedge shaped hypergranulosis","x":8224,"y":11664,"width":2441,"height":1616},{"key":"lack","label":"Civatte body","x":2610,"y":3586,"width":1290,"height":903},{"key":"noClear","label":"Superficial dermal inflammatory infiltrates","x":11654,"y":12853,"width":1728,"height":2275},{"key":"a1","label":"Melanin pigment incontinence","x":13491,"y":14148,"width":2345,"height":1768},{"key":"b2","label":"Sawtoothing of rete ridges","x":6596,"y":9404,"width":3737,"height":3617}]}}'::jsonb,
    updated_at = now()
where kind = 'site_settings' and id = 'main';
