var FooterTmpl =
['p',
    'Show: ',
    ['$each {filters}',
        ['$if {filter:isCurrent}',
            '{name}',
        '$else',
            ['<a href=# data-filter={filter} onClick={filterChange}>', '{name}']
        ],
        ['$if {name:isActive}',
            '.',
        '$else',
            ', '
        ]
    ],
'/p']