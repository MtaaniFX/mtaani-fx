-- Create default group types
insert into group_types (name, interest_rate)
values ('group', 5),
       ('individual_normal', 10),
       ('individual_locked', 20);

select * from group_types;
select * from group_types where name = 'group';



select * from auth.users;

